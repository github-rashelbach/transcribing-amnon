import { MessageHandler } from './';
import { AudioMessage } from '../external-types/messages';
import { LoggerMessages } from '../services/logger';
import { Services } from '../services';
import { AudioUtils } from '../utils/audio-utils';
import Content from '../content.json';

export const handleAudio: MessageHandler<AudioMessage> = async (message: AudioMessage, phoneNumberId: string, services: Services) => {
  const metadata = { fromId: phoneNumberId, to: message.from };

  const handleDurationInLimit = async (data: Uint8Array) => {
    const transcription = await speechToText.recognize(data);
    logger.info({ transcription }, LoggerMessages.TranscriptionSuccess);
    if (transcription) {
      logger.info({}, LoggerMessages.ReplyingToMessage);
      await publisher.publishToNotificationQueue({ ...metadata, text: transcription });
    } else {
      logger.info({}, LoggerMessages.CouldNotTranscribe);
      await publisher.publishToNotificationQueue({ ...metadata, text: Content.CouldNotTranscribe });
    }
  };

  const { httpService, speechToText, logger, publisher } = services;
  if (message.audio) {
    const mediaUrl = await httpService.getMediaUrl(message.audio.id);
    const data = await httpService.downloadFile(mediaUrl);
    const duration = await AudioUtils.getAudioDurationInSeconds(data);

    if (duration < 60) {
      await handleDurationInLimit(data);
      await services.users.updateUserUsage(metadata.to, {
        duration,
        createdAt: new Date().toISOString()
      });
    } else {
      logger.info({ duration }, LoggerMessages.TimeLimit);
      await publisher.publishToNotificationQueue({ ...metadata, text: Content.TimeLimit });
    }


  }
};
