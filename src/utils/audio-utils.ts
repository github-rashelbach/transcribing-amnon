import { parseBuffer } from 'music-metadata';


export const AudioUtils = {
  async getAudioDurationInSeconds(input: Uint8Array): Promise<number> {
    const data = await parseBuffer(input);
    return data.format.duration || 0;

  }
};
