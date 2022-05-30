import { APIGatewayEvent, APIGatewayProxyEvent, Handler } from 'aws-lambda';
import { createLogger, LoggerMessages } from '../services/logger';
import { LambdaResponder } from '../utils/lambda-responder';
import { WhatsappMessagePayload } from '../external-types/whatsapp';
import axios from 'axios';
import { HttpService } from '../services/http';
import {
  CloudApiPayloadExtractor, MessageTypes
} from '../utils/cloud-api-payload-extractor/cloud-api-payload-extractor';
import { Logger } from 'pino';
import { SpeechToText } from '../services/speech-to-text/speech-to-text';
import { GoogleSpeechToTextProvider } from '../services/speech-to-text/providers/google';

const CLOUD_API_ACCESS_TOKEN = process.env.CLOUD_API_ACCESS_TOKEN!;

export const cloudApiHandler: Handler<APIGatewayEvent> = async (event, context) => {
  const logger = createLogger(event, context);
  if (event.httpMethod === 'GET') {
    return verifyWebhook(event, logger);
  }
  const httpClient = axios.create({ headers: { 'Authorization': 'Bearer ' + CLOUD_API_ACCESS_TOKEN } });
  const httpService = new HttpService(logger, httpClient);
  if (event.body) {
    return handleMessage(JSON.parse(event.body), httpService, logger);
  }
  return LambdaResponder.error(1000, 'Could not response with body');
};

export async function handleMessage(whatsappPayload: WhatsappMessagePayload, httpService: HttpService, logger: Logger) {
  logger.info(whatsappPayload, LoggerMessages.CloudApiIncomingMessage);
  const payloadExtractor = new CloudApiPayloadExtractor(whatsappPayload);
  switch (payloadExtractor.getMessageType()) {
    case MessageTypes.Text: {
      const text = payloadExtractor.getText();
      logger.info(text, LoggerMessages.ReceivedTextMessage);
      return LambdaResponder.success({ text });
    }
    case MessageTypes.Audio: {
      const speechToText = new SpeechToText(new GoogleSpeechToTextProvider(logger));
      const audioData = payloadExtractor.getAudioData();
      if (audioData) {
        const mediaUrl = await httpService.getMediaUrl(audioData.mediaId);
        const data = await httpService.downloadFile(mediaUrl);
        const transcription = await speechToText.recognize(data);
        logger.info(transcription, LoggerMessages.TranscriptionSuccess);
        return LambdaResponder.success({ transcription });
      }
      return LambdaResponder.error(1000, 'Could not find audio when type is audio');
    }
    default:
      return LambdaResponder.error(1000, 'Could not response with body');
  }

}

export const verifyWebhook = (event: APIGatewayProxyEvent, logger: Logger) => {
  logger.info(event, LoggerMessages.CloudApiVerifyWebhook);
  const mode = event.queryStringParameters?.['hub.mode'];
  const token = event.queryStringParameters?.['hub.verify_token'];
  const challenge = event.queryStringParameters?.['hub.challenge'];

  return mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN ?
    LambdaResponder.success(challenge) :
    LambdaResponder.error(403, 'Could not verify webhook');

};
