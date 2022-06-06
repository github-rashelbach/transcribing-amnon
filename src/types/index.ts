export interface Recording {
  data: Uint8Array;
}

export interface NotifyMessage {
  fromId: string;
  to: string;
  text: string;
}

export interface FacebookAudioRecording {
  messageId: string;
  senderId: string;
  mediaId: string;
  timestamp: string;
}
