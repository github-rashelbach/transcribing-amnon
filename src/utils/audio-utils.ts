import execa  from 'execa';


export const AudioUtils = {
  async getAudioDurationInSeconds(input: Buffer) {
    const ffprobeParams = [
      '-v',
      'error',
      '-select_streams',
      'a:0',
      '-show_format',
      '-show_streams',
      '-i',
      'pipe:0'
    ];
    const { stdout } = await execa('ffprobe', ffprobeParams, {
      reject: false,
      input
    });
    const matched = stdout.match(/duration="?(\d*\.\d*)"?/);
    return matched && matched[1] ? parseFloat(matched[1]) : 0;

  }
};
