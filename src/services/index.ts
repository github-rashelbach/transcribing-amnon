import { SpeechToText } from './speech-to-text/speech-to-text';
import { HttpService } from './http';
import { Logger } from 'pino';
import { Publisher } from './publisher';
import { UsersService } from './users';

export interface Services {
  speechToText: SpeechToText,
  httpService: HttpService,
  logger: Logger,
  publisher: Publisher,
  users: UsersService
}
