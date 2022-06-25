export enum MessageTypeDomain {
  TranscriptionRequest = 'transcription_request',
  InboundTextMessage = 'incoming_text_message',
}

export enum TranscriptionStatusDomain {
  success = 'success',
  failed = 'failed',
  limitExceeded = 'limit_exceeded'
}

export interface MessageDomain {
  userIdMessageType: string;
  createdAt: string;
  transcriptionStatus: TranscriptionStatusDomain;
  duration: number;
  content: string | null;
}
