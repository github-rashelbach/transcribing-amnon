import { MessageBody } from './whatsapp';

interface TextMessageBody {
  body: string;
}

interface ImageMessageBody {
  caption: string;
  mime_type: string;
  sha256: string;
  id: string;
}

interface LocationMessageBody {
  latitude: string;
  longitude: string;
  name: string;
  address: string;
}

interface AudioMessageBody {
  mime_type: string;
  sha256: string;
  id: string;
  voice: boolean;
}

interface StickerMessageBody extends MessageBody {
  mime_type: string;
  sha256: string;
  id: string;
}

interface ErrorMessageBody extends MessageBody {
  code: number;
  details: string;
  title: string;
}

export interface ImageMessage extends MessageBody {
  type: 'image';
  image: ImageMessageBody;
}

export interface TextMessage extends MessageBody {
  type: 'text';
  text: TextMessageBody;
}

export interface AudioMessage extends MessageBody {
  type: 'audio';
  audio: AudioMessageBody;
}

export interface LocationMessage extends MessageBody {
  type: 'location';
  location: LocationMessageBody;
}

export interface StickerMessage extends MessageBody {
  type: 'sticker';
  sticker: StickerMessageBody;
}

export interface UnknownMessage extends MessageBody {
  type: 'unknown';
  errors: ErrorMessageBody[];
}

export type Message =
  AudioMessage
  | TextMessage
  | ImageMessage
  | LocationMessage
  | StickerMessage
  | UnknownMessage;
