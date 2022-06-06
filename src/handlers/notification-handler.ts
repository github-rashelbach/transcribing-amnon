import { SQSHandler } from 'aws-lambda';
import { NotifyMessage } from '../types';
import { HttpService } from '../services/http';
import { createLogger } from '../services/logger';
import { WhatsappService } from '../services/whatsapp';

export const handle: SQSHandler = async (event, context) => {
  const logger = createLogger(event, context);
  const httpService = new HttpService(logger);
  const whatsappService = new WhatsappService(httpService);
  const { to, text, fromId }: NotifyMessage = JSON.parse(event.Records[0].body);
  await whatsappService.sendTextMessage(fromId, text, to);
};
