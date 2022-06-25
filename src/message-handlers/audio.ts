import { MessageHandler } from './';
import { AudioMessage } from '../external-types/messages';
import { LoggerMessages } from '../services/logger';
import { Services } from '../services';
import { AudioUtils } from '../utils/audio-utils';
import Content from '../content.json';
import { UserInfo } from '../utils/cloud-api-payload-extractor/cloud-api-payload-extractor';
import { MessageTypeDomain, TranscriptionStatusDomain } from '../model/message';

export const handleAudio: MessageHandler<AudioMessage> = async (message: AudioMessage, userInfo: UserInfo, phoneNumberId: string, services: Services) => {
  const metadata = { fromId: phoneNumberId, to: message.from };

  const handleDurationInLimit = async (data: Uint8Array): Promise<string | null> => {
    const transcription = await speechToText.recognize(data);
    logger.info({ transcription }, LoggerMessages.TranscriptionSuccess);
    if (transcription) {
      logger.info({}, LoggerMessages.ReplyingToMessage);
      await publisher.publishToNotificationQueue({ ...metadata, text: transcription });
    } else {
      logger.info({}, LoggerMessages.CouldNotTranscribe);
      await publisher.publishToNotificationQueue({ ...metadata, text: Content.CouldNotTranscribe });
    }
    return transcription || null;
  };

  const { httpService, speechToText, logger, publisher } = services;
  if (message.audio) {
    const mediaUrl = await httpService.getMediaUrl(message.audio.id);
    const data = await httpService.downloadFile(mediaUrl);
    const duration = await AudioUtils.getAudioDurationInSeconds(data);
    const partIncomingMessage = {
      type: MessageTypeDomain.TranscriptionRequest,
      createdAt: new Date(parseInt(message.timestamp) * 1000).toISOString(),
      userId: userInfo.userId,
    };
    if (duration < 60) {
      const transcription = await handleDurationInLimit(data);
      await services.messages.insertIncomingMessage({
        ...partIncomingMessage,
        content: transcription,
        duration,
        transcriptionStatus: transcription ? TranscriptionStatusDomain.success : TranscriptionStatusDomain.failed
      });
    } else {
      logger.info({ duration }, LoggerMessages.TimeLimit);
      await publisher.publishToNotificationQueue({ ...metadata, text: Content.TimeLimit });
      await services.messages.insertIncomingMessage({
        ...partIncomingMessage,
        content: null,
        duration,
        transcriptionStatus: TranscriptionStatusDomain.limitExceeded
      });
    }


  }
};
