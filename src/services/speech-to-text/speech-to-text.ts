import { Recording } from '../../types';

export interface SpeechToTextAdapter {
  recognize(audio: Recording): Promise<string>;
}

export class SpeechToText {
  constructor(private readonly provider: SpeechToTextAdapter) {
  }

  async recognize(data: Uint8Array): Promise<string> {
    return this.provider.recognize({ data });
  }

}
