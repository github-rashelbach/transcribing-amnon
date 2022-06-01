import { MessageBody, WhatsappMessagePayload } from '../../external-types/whatsapp';
import { FacebookAudioRecording } from '../../types';
import { AudioMessage, TextMessage } from '../../external-types/messages';

export enum MessageTypes {
  Audio = 'audio',
  Text = 'text',
  Sticker = 'sticker',
  Image = 'image',
  Location = 'location',
}

const CloudApiTypeToType = {
  audio: MessageTypes.Audio,
  text: MessageTypes.Text,
  image: MessageTypes.Image,
  sticker: MessageTypes.Sticker,
  location: MessageTypes.Location,


};

export class CloudApiPayloadExtractor {
  constructor(private readonly payload: WhatsappMessagePayload) {
  }

  static isAudio(message: MessageBody | undefined): message is MessageBody & AudioMessage {
    return message?.type === MessageTypes.Audio;
  }

  getMessageType(): string | null {
    const message = this.payload.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    return CloudApiTypeToType[message?.type || ''] || null;
  }

  getText(): string | null {
    const message = this.payload.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    return this.getMessageType() === MessageTypes.Text ? (message as TextMessage).text.body : null;
  }

  getAudioData(): FacebookAudioRecording | null {
    const message = this.payload.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (this.getMessageType() === MessageTypes.Audio) {
      return {
        mediaId: (message as AudioMessage).audio.id,
        messageId: message?.id || '',
        timestamp: message?.timestamp || '',
        senderId: message?.from || '',
      };
    }
    return null;
  }

  getPhoneNumberId(): string | null {
    return this.payload.entry?.[0]?.changes?.[0]?.value?.metadata?.phone_number_id || null;
  }
}
