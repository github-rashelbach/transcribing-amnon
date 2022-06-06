import { SQSHandler } from 'aws-lambda';
import { NotifyMessage } from '../types';
import { HttpService } from '../services/http';
import { createLogger, LoggerMessages } from '../services/logger';
import { WhatsappService } from '../services/whatsapp';

export const handle: SQSHandler = async (event, context) => {
  const logger = createLogger(event, context);
  const httpService = new HttpService(logger);
  const whatsappService = new WhatsappService(httpService);
  const message: NotifyMessage = JSON.parse(event.Records[0].body);
  logger.info({ message }, LoggerMessages.NotifyRequest);
  const { to, text, fromId } = message;
  await whatsappService.sendTextMessage(fromId, text, to);
};
