export interface Recording {
  data: Uint8Array;
}

export interface FacebookAudioRecording {
  messageId: string;
  senderId: string;
  mediaId: string;
  timestamp: string;
}
