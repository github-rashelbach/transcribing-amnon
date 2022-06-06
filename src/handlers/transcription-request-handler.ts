import { SQSHandler } from 'aws-lambda';
import { createLogger, LoggerMessages } from '../services/logger';
import axios from 'axios';
import { HttpService } from '../services/http';
import { WhatsappMessagePayload } from '../external-types/whatsapp';
import {
  CloudApiPayloadExtractor
} from '../utils/cloud-api-payload-extractor/cloud-api-payload-extractor';
import { WhatsappService } from '../services/whatsapp';
import { SpeechToText } from '../services/speech-to-text/speech-to-text';
import { GoogleSpeechToTextProvider } from '../services/speech-to-text/providers/google';
import { Services } from '../services';
import { MessageTypeToHandler } from '../message-handlers';

const CLOUD_API_ACCESS_TOKEN = process.env.CLOUD_API_ACCESS_TOKEN!;
const IM_ON_IT = 'קיבלתי, אני על זה!';

export const handle: SQSHandler = async (event, context) => {
  const httpClient = axios.create({ headers: { 'Authorization': 'Bearer ' + CLOUD_API_ACCESS_TOKEN } });
  const logger = createLogger(event, context);
  const httpService = new HttpService(logger, httpClient);
  const whatsappService = new WhatsappService(httpService);
  const whatsappPayload: WhatsappMessagePayload = JSON.parse(event.Records[0].body);
  const payloadExtractor = new CloudApiPayloadExtractor(whatsappPayload);
  const fromId = payloadExtractor.getPhoneNumberId();
  const sender = payloadExtractor.getSender();
  logger.info({ whatsappPayload }, LoggerMessages.WhatsappPayload);
  const services: Services = {
    httpService,
    logger,
    whatsappService,
    speechToText: new SpeechToText(new GoogleSpeechToTextProvider(logger)),
  };
  if (fromId && sender) {
    await whatsappService.sendTextMessage(fromId, IM_ON_IT, sender);
    const messageType = payloadExtractor.getMessageType();
    const messageHandler = messageType ? MessageTypeToHandler[messageType] : null;
    if (messageHandler) {
      messageHandler(payloadExtractor.getMessage(), fromId, services);
    } else {
      logger.info({ messageType }, LoggerMessages.UnsupportedMessageType);
    }
  }



};
