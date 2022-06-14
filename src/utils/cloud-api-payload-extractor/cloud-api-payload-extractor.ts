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

  get messageType(): string | null {
    const message = this.payload.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    return CloudApiTypeToType[message?.type || ''] || null;
  }

  get message(): Message | null {
    return this.payload.entry?.[0]?.changes?.[0]?.value?.messages?.[0] || null;
  }

  get phoneNumberId(): string | null {
    return this.payload.entry?.[0]?.changes?.[0]?.value?.metadata?.phone_number_id || null;
  }

  get sender(): string | null {
    return this.message?.from || null;
  }
}
