import { APIGatewayEvent, Handler } from 'aws-lambda';
import { createLogger, LoggerMessages } from '../services/logger';
import { LambdaResponder } from '../utils/lambda-responder';
import { WhatsappMessagePayload } from '../external-types/whatsapp';
import axios from 'axios';
import { HttpService } from '../services/http';
import {
  CloudApiPayloadExtractor
} from '../utils/cloud-api-payload-extractor/cloud-api-payload-extractor';

const CLOUD_API_ACCESS_TOKEN = process.env.CLOUD_API_ACCESS_TOKEN!;

export const cloudApiHandler: Handler<APIGatewayEvent> = async (event, context) => {
  const logger = createLogger(event, context);
  const httpClient = axios.create({ headers: { 'Authorization': 'Bearer ' + CLOUD_API_ACCESS_TOKEN } });
  const httpService = new HttpService(logger, httpClient);
  if (event.body) {
    const whatsAppPayload: WhatsappMessagePayload = JSON.parse(event.body);
    logger.info(whatsAppPayload, LoggerMessages.CloudApiIncomingMessage);
    const payloadExtractor = new CloudApiPayloadExtractor(whatsAppPayload);
    const mediaInfo = payloadExtractor.getAudioData();
    if (mediaInfo) {
      const mediaUrl = await httpService.getMediaUrl(mediaInfo.mediaId);
      logger.info(mediaUrl, LoggerMessages.GetMediaUrl);
    }


    return LambdaResponder.success({ whatsAppPayload });
  }
  return LambdaResponder.error(1000, 'Could not response with body');
};
