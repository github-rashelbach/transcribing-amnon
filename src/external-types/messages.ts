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

interface StickerMessageBody {
  mime_type: string;
  sha256: string;
  id: string;
}

interface ErrorMessageBody {
  code: number;
  details: string;
  title: string;
}

export interface ImageMessage {
  type: 'image';
  image: ImageMessageBody;
}

export interface TextMessage {
  type: 'text';
  text: TextMessageBody;
}

interface AudioMessageBody {
  mime_type: string;
  sha256: string;
  id: string;
  voice: boolean;
}

export interface AudioMessage {
  type: 'audio';
  audio: AudioMessageBody;
}

export interface LocationMessage {
  type: 'location';
  location: LocationMessageBody;
}

export interface StickerMessage {
  type: 'sticker';
  sticker: StickerMessageBody;
}

export interface UnknownMessage {
  type: 'unknown';
  errors: ErrorMessageBody[];
}
