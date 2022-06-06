import { SQSHandler } from 'aws-lambda';
import { createLogger, LoggerMessages } from '../services/logger';
import { HttpService } from '../services/http';
import { WhatsappMessagePayload } from '../external-types/whatsapp';
import {
  CloudApiPayloadExtractor
} from '../utils/cloud-api-payload-extractor/cloud-api-payload-extractor';
import { SpeechToText } from '../services/speech-to-text/speech-to-text';
import { GoogleSpeechToTextProvider } from '../services/speech-to-text/providers/google';
import { Services } from '../services';
import { MessageTypeToHandler } from '../message-handlers';
import { Publisher } from '../services/publisher';

const IM_ON_IT = 'קיבלתי, אני על זה!';

export const handle: SQSHandler = async (event, context) => {
  const logger = createLogger(event, context);
  const publisher = new Publisher();
  const httpService = new HttpService(logger);
  const whatsappPayload: WhatsappMessagePayload = JSON.parse(event.Records[0].body);
  const payloadExtractor = new CloudApiPayloadExtractor(whatsappPayload);
  const fromId = payloadExtractor.getPhoneNumberId();
  const sender = payloadExtractor.getSender();
  logger.info({ whatsappPayload }, LoggerMessages.WhatsappPayload);
  const services: Services = {
    httpService,
    logger,
    publisher,
    speechToText: new SpeechToText(new GoogleSpeechToTextProvider(logger)),
  };
  if (fromId && sender) {
    await publisher.publishToNotificationQueue({fromId, to: sender, text: IM_ON_IT});
    const messageType = payloadExtractor.getMessageType();

    const messageHandler = messageType ? MessageTypeToHandler[messageType] : null;
    if (messageHandler) {
      messageHandler(payloadExtractor.getMessage(), fromId, services);
    } else {
      logger.info({ messageType }, LoggerMessages.UnsupportedMessageType);
    }
  }



};
