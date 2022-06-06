import { MessageHandler } from './';
import { AudioMessage } from '../external-types/messages';
import { LoggerMessages } from '../services/logger';
import { Services } from '../services';

export const handleAudio: MessageHandler<AudioMessage> = async (message: AudioMessage, phoneNumberId: string, services: Services) => {
  const { httpService, speechToText, logger, publisher } = services;
  if (message.audio) {
    const mediaUrl = await httpService.getMediaUrl(message.audio.id);
    const data = await httpService.downloadFile(mediaUrl);
    const transcription = await speechToText.recognize(data);
    logger.info({ transcription }, LoggerMessages.TranscriptionSuccess);
    if (transcription) {
      logger.info({}, LoggerMessages.ReplyingToMessage);
      await publisher.publishToNotificationQueue({
        fromId: phoneNumberId,
        to: message.from,
        text: transcription
      });
    }
  }
};
