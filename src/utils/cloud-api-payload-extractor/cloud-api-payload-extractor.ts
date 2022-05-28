import { MessageBody, WhatsappMessagePayload } from '../../external-types/whatsapp';
import { FacebookAudioRecording } from '../../types';
import { AudioMessage } from '../../external-types/messages';

enum MessageTypes {
  audio = 'audio',
}

export class CloudApiPayloadExtractor {
  constructor(private readonly payload: WhatsappMessagePayload) {}

  static isAudio(message: MessageBody | undefined): message is MessageBody & AudioMessage {
    return message?.type === MessageTypes.audio;
  }

  getAudioData(): FacebookAudioRecording | null {
    const message = this.payload.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (CloudApiPayloadExtractor.isAudio(message)) {
      return {
        mediaId: message.audio.id,
        messageId: message.id,
        timestamp: message.timestamp,
        senderId: message.from,
      };
    }
    return null;
  }
}
