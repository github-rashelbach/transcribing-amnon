import { AudioMessage, ImageMessage, LocationMessage, StickerMessage, TextMessage, UnknownMessage } from './messages';

export interface Metadata {
  display_phone_number: string;
  phone_number_id: string;
}

export interface Profile {
  name: string;
}

export interface Contact {
  profile: Profile;
  wa_id: string;
}

export type MessageBody = {
  from: string;
  id: string;
  timestamp: string;
} & (TextMessage | ImageMessage | StickerMessage | AudioMessage | UnknownMessage | LocationMessage);

export interface Value {
  messaging_product: string;
  metadata: Metadata;
  contacts: Contact[];
  messages: MessageBody[];
}

export interface Change {
  value: Value | null;
  field: string;
}

export interface Entry {
  id: string;
  changes: Change[] | null;
}

export interface WhatsappMessagePayload {
  object: string;
  entry: Entry[] | null;
}
