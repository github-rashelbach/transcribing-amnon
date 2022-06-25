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
import { MessagesService } from '../services/messages';



export const handle: SQSHandler = async (event, context) => {
  const logger = createLogger(event, context);
  const publisher = new Publisher();
  const httpService = new HttpService(logger);
  const userService = new UsersService(createDynamoDBClient(), logger);
  const messagesService = new MessagesService(createDynamoDBClient(), logger);
  const whatsappPayload: WhatsappMessagePayload = JSON.parse(event.Records[0].body);
  const payloadExtractor = new CloudApiPayloadExtractor(whatsappPayload);
  const fromId = payloadExtractor.phoneNumberId;
  const sender = payloadExtractor.sender;
  const userInfo = payloadExtractor.userInfo;
  logger.info({ whatsappPayload }, LoggerMessages.WhatsappPayload);
  const services: Services = {
    httpService,
    logger,
    publisher,
    users: userService,
    messages: messagesService,
    speechToText: new SpeechToText(new GoogleSpeechToTextProvider(logger)),
  };
  if (fromId && sender) {
    const messageType = payloadExtractor.messageType;

    const messageHandler = messageType ? MessageTypeToHandler[messageType] : null;
    if (messageHandler) {
      await messageHandler(payloadExtractor.message, userInfo, fromId, services);
    } else {
      logger.info({ messageType }, LoggerMessages.UnsupportedMessageType);
    }
  }


};
