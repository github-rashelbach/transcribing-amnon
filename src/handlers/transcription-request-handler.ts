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
import { UsersService } from '../services/users';
import { createDynamoDBClient } from '../model/db';


export const handle: SQSHandler = async (event, context) => {
  const logger = createLogger(event, context);
  const publisher = new Publisher();
  const httpService = new HttpService(logger);
  const userService = new UsersService(createDynamoDBClient());
  const whatsappPayload: WhatsappMessagePayload = JSON.parse(event.Records[0].body);
  const payloadExtractor = new CloudApiPayloadExtractor(whatsappPayload);
  const fromId = payloadExtractor.phoneNumberId;
  const sender = payloadExtractor.sender;
  logger.info({ whatsappPayload }, LoggerMessages.WhatsappPayload);
  const services: Services = {
    httpService,
    logger,
    publisher,
    users: userService,
    speechToText: new SpeechToText(new GoogleSpeechToTextProvider(logger)),
  };
  if (fromId && sender) {
    const messageType = payloadExtractor.messageType;

    const messageHandler = messageType ? MessageTypeToHandler[messageType] : null;
    if (messageHandler) {
      await messageHandler(payloadExtractor.message, fromId, services);
    } else {
      logger.info({ messageType }, LoggerMessages.UnsupportedMessageType);
    }
  }


};
