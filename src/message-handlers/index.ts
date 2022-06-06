import { MessageBody } from '../external-types/whatsapp';
import { Services } from '../services';
import { MessageTypes } from '../utils/cloud-api-payload-extractor/cloud-api-payload-extractor';
import { LoggerMessages } from '../services/logger';
import { Message } from '../external-types/messages';
import { handleAudio } from './audio';

export type MessageHandler<T extends MessageBody = any> = (message: T, phoneNumberId: string, services: Services) => Promise<void>;

const genericHandler: MessageHandler<Message> = async (message, phoneNumberId, services) => {
  const { logger } = services;
  logger.info({ message }, LoggerMessages.ReceivedUnsupportedMessage);
}

export const MessageTypeToHandler: Record<MessageTypes, MessageHandler> = {
  [MessageTypes.Audio]: handleAudio,
  [MessageTypes.Image]: genericHandler,
  [MessageTypes.Location]: genericHandler,
  [MessageTypes.Sticker]: genericHandler,
  [MessageTypes.Text]: genericHandler,

}
