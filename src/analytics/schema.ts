export enum DBNames {
  messages = 'messages'
}

export interface Message {
  userId: string; // phone number
  messageId: string;
  senderId: string;
  messageLength: string;
  createdAt: string;
  messageType: string;
}


export enum MessageType {
  TranscriptionRequest = 'transcription_request',
  TranscriptionSuccess = 'transcription_success',
  LimitExceeded = 'limit_exceeded',
  NoPossibleTranscription = 'no_possible_transcription',
}
