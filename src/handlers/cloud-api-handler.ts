import { Handler } from 'aws-lambda';
import { createLogger, LoggerMessages } from '../services/logger';
import { LambdaResponder } from '../utils/lambda-responder';
import { WhatsappMessagePayload } from '../external-types/whatsapp';
import axios from 'axios';
import { HttpService } from '../services/http';
import {
  CloudApiPayloadExtractor,
  MessageTypes
} from '../utils/cloud-api-payload-extractor/cloud-api-payload-extractor';
import { Logger } from 'pino';
import { SpeechToText } from '../services/speech-to-text/speech-to-text';
import { GoogleSpeechToTextProvider } from '../services/speech-to-text/providers/google';
import { APIGatewayProxyEventV2 } from 'aws-lambda/trigger/api-gateway-proxy';
import { StatusCodes } from 'http-status-codes';
import { WhatsappService } from '../services/whatsapp';

const CLOUD_API_ACCESS_TOKEN = process.env.CLOUD_API_ACCESS_TOKEN!;

export const cloudApiHandler: Handler<APIGatewayProxyEventV2> = async (event, context) => {
  const logger = createLogger(event, context);
  logger.info({ event }, LoggerMessages.CloudApiIncomingMessage);
  if (event.requestContext.http.method === 'GET') {
    return verifyWebhook(event, logger);
  }
  const httpClient = axios.create({ headers: { 'Authorization': 'Bearer ' + CLOUD_API_ACCESS_TOKEN } });
  const httpService = new HttpService(logger, httpClient);
  if (event.body) {
    return handleMessage(JSON.parse(event.body), httpService, logger);
  }
  return LambdaResponder.error(StatusCodes.BAD_REQUEST, 'Could not response with body');
};

async function handleMessage(whatsappPayload: WhatsappMessagePayload, httpService: HttpService, logger: Logger) {
  logger.info({ whatsappPayload }, LoggerMessages.WhatsappPayload);
  const payloadExtractor = new CloudApiPayloadExtractor(whatsappPayload);
  const whatsappService = new WhatsappService(httpService);
  switch (payloadExtractor.getMessageType()) {
    case MessageTypes.Text: {
      const text = payloadExtractor.getText();
      logger.info({ text }, LoggerMessages.ReceivedTextMessage);
      return LambdaResponder.success(JSON.stringify({ text }));
    }
    case MessageTypes.Audio: {
      const speechToText = new SpeechToText(new GoogleSpeechToTextProvider(logger));
      const fromId = payloadExtractor.getPhoneNumberId();
      const audioData = payloadExtractor.getAudioData();
      if (audioData && fromId) {
        const mediaUrl = await httpService.getMediaUrl(audioData.mediaId);
        const data = await httpService.downloadFile(mediaUrl);
        const transcription = await speechToText.recognize(data);
        logger.info({ transcription }, LoggerMessages.TranscriptionSuccess);
        logger.info({}, LoggerMessages.ReplyingToMessage);
        await whatsappService.sendTextMessage(fromId, transcription, audioData.senderId);
        return LambdaResponder.success(JSON.stringify({ transcription, fromId, audioData }));
      }
      logger.info({ audioData }, LoggerMessages.CouldNotGetAudioFromAudioMessage);
      return LambdaResponder.success(JSON.stringify({ message: 'Could not find audio when type is audio' }));

    }
    default:
      logger.info({}, LoggerMessages.NoHandlerForTypeOfMessage);
      return LambdaResponder.success(JSON.stringify({}));
  }

}

const verifyWebhook = (event: APIGatewayProxyEventV2, logger: Logger) => {
  logger.info({ event }, LoggerMessages.CloudApiVerifyWebhook);
  const mode = event.queryStringParameters?.['hub.mode'];
  const token = event.queryStringParameters?.['hub.verify_token'];
  const challenge = event.queryStringParameters?.['hub.challenge'] || '';

  return mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN ?
    LambdaResponder.success(challenge) :
    LambdaResponder.error(StatusCodes.UNAUTHORIZED, 'Could not verify webhook');

};
