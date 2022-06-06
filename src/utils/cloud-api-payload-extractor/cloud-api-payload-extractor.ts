import { WhatsappMessagePayload } from '../../external-types/whatsapp';
import { Message } from '../../external-types/messages';

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

  getMessageType(): string | null {
    const message = this.payload.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    return CloudApiTypeToType[message?.type || ''] || null;
  }

  getMessage(): Message | null {
    return this.payload.entry?.[0]?.changes?.[0]?.value?.messages?.[0] || null;
  }

  getPhoneNumberId(): string | null {
    return this.payload.entry?.[0]?.changes?.[0]?.value?.metadata?.phone_number_id || null;
  }

  getSender(): string | null {
    return this.getMessage()?.from || null;
  }
}
