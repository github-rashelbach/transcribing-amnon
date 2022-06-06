import { Message } from './messages';

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
}


export interface Value {
  messaging_product: string;
  metadata: Metadata;
  contacts: Contact[];
  messages: Message[];
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

export interface OutgoingMessageBase {
  messaging_product: 'whatsapp';
  preview_url: boolean;
  recipient_type: string;
  to: string;
}

export interface OutgoingTextBody {
  type: 'text';
  text: {
    body: string;
  };
}

export type OutgoingTextMessage = OutgoingMessageBase & OutgoingTextBody

export type OutgoingMessage = OutgoingTextMessage
