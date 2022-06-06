import { SpeechToText } from './speech-to-text/speech-to-text';
import { HttpService } from './http';
import { WhatsappService } from './whatsapp';
import { Logger } from 'pino';

export interface Services {
  speechToText: SpeechToText,
  httpService: HttpService,
  whatsappService: WhatsappService,
  logger: Logger,
}
