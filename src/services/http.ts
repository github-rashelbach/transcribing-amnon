import { Logger } from 'pino';
import { AxiosInstance } from 'axios';
import { LoggerMessages } from './logger';
import { OutgoingMessage } from '../external-types/whatsapp';

const BASE_URL = 'https://graph.facebook.com/v13.0';
const Urls = {
  Messages: (phoneNumberId: string) => `${BASE_URL}/${phoneNumberId}/messages`,
};

export interface IHttpService {
  downloadFile: (url: string) => Promise<Uint8Array>;
  getMediaUrl: (mediaId: string) => Promise<string>;
  message: (phoneNumberId: string, message: OutgoingMessage) => Promise<boolean>;
}

export class HttpService implements IHttpService {
  constructor(private readonly logger: Logger, private readonly httpClient: AxiosInstance) {
  }

  getMediaUrl(mediaId: string): Promise<string> {
    this.logger.info({ mediaId }, LoggerMessages.GetMediaUrl);
    return this.httpClient.get(`${BASE_URL}/${mediaId}`)
      .then(response => (response.data.url as string))
      .catch(error => {
        this.logger.error({ error: error.data }, LoggerMessages.GetMediaUrlError);
        throw error;
      });
  }

  downloadFile(url: string): Promise<Uint8Array> {
    this.logger.info({ url }, LoggerMessages.DownloadFile);
    return this.httpClient.get(url, { responseType: 'arraybuffer' })
      .then(response => (response.data as Uint8Array))
      .catch(error => {
        this.logger.error({ error: error.data }, LoggerMessages.DownloadFileError);
        throw error;
      });
  }

  message(fromPhoneNumberId: string, message: OutgoingMessage): Promise<boolean> {
    const url = Urls.Messages(fromPhoneNumberId);
    this.logger.info({ message }, LoggerMessages.SendMessage);
    return this.httpClient.post(url, message)
      .then(({data}) => {
        this.logger.info({ data }, LoggerMessages.SendMessageSuccess);
        return true;
      })
      .catch(error => {
        this.logger.error({ error: error.data }, LoggerMessages.SendMessageError);
        return false;
      });
  }

}
