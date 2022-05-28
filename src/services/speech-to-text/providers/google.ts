import { SpeechToTextAdapter } from '../speech-to-text';
import { Recording } from '../../../types';
import { SpeechClient } from '@google-cloud/speech';
import { Logger } from 'pino';
import { LoggerMessages } from '../../logger';

const GCLOUD_PROJECT_ID = process.env.GCLOUD_PROJECT_ID!;
const GCLOUD_CLIENT_EMAIL = process.env.GCLOUD_CLIENT_EMAIL!;
const GCLOUD_PRIVATE_KEY = process.env.GCLOUD_PRIVATE_KEY!;

const opts = {
  projectId: GCLOUD_PROJECT_ID,
  credentials: {
    client_email: GCLOUD_CLIENT_EMAIL,
    private_key: GCLOUD_PRIVATE_KEY
  }
};

export class GoogleSpeechToTextProvider implements SpeechToTextAdapter {
  constructor(
    private readonly client: SpeechClient = new SpeechClient(opts),
    private readonly logger: Logger) {
  }

  async recognize(audio: Recording): Promise<string> {
    const [response] = await this.client.recognize({
      config: {
        encoding: 'OGG_OPUS',
        sampleRateHertz: 16000,
        languageCode: 'iw-IL'
      },
      audio: {
        content: audio.data,
      }
    });
    this.logger.info(response, LoggerMessages.GoogleSpeechToTextResponse);
    return (response?.results || [])
      .map(result => (result?.alternatives || [])[0].transcript)
      .join('\n');
  }

}