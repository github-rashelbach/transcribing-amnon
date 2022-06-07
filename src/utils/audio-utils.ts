import execa from 'execa';
import { Logger } from 'pino';


export const AudioUtils = {
  async getAudioDurationInSeconds(input: Buffer, logger: Logger) {
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
    try {
      const { stdout, stderr } = await execa('ffprobe', ffprobeParams, {
        input
      });
      logger.info({ stdout }, 'ffprobe stdout');
      logger.info({ stderr }, 'ffprobe stderr');
      const matched = stdout.match(/duration="?(\d*\.\d*)"?/);
      return matched && matched[1] ? parseFloat(matched[1]) : 0;
    } catch (e) {
      logger.error({ e }, 'ffprobe error');
      return 0;
    }


  }
};
