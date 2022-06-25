import { MessageBody } from '../external-types/whatsapp';
import { Services } from '../services';
import {
  MessageTypes,
  UserInfo
} from '../utils/cloud-api-payload-extractor/cloud-api-payload-extractor';
import { LoggerMessages } from '../services/logger';
import { Message } from '../external-types/messages';
import { handleAudio } from './audio';
import Content from '../content.json';

export type MessageHandler<T extends MessageBody = any> = (message: T, userInfo: UserInfo, phoneNumberId: string, services: Services) => Promise<void>;

const genericHandler: MessageHandler<Message> = async (message, userInfo, phoneNumberId, services) => {
  const { logger, publisher } = services;
  logger.info({ message }, LoggerMessages.ReceivedUnsupportedMessage);
  await publisher.publishToNotificationQueue({
    fromId: phoneNumberId,
    to: message.from,
    text: Content.IncomingMessageNotSupported
  });

};

export const MessageTypeToHandler: Record<MessageTypes, MessageHandler> = {
  [MessageTypes.Audio]: handleAudio,
  [MessageTypes.Image]: genericHandler,
  [MessageTypes.Location]: genericHandler,
  [MessageTypes.Sticker]: genericHandler,
  [MessageTypes.Text]: genericHandler,

};
