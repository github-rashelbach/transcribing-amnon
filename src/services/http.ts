import { Logger } from 'pino';
import { AxiosInstance } from 'axios';
import { LoggerMessages } from './logger';

const Urls = {
  GraphURL: 'https://graph.facebook.com/v13.0/',
};

export interface IHttpService {
  downloadFile: (url: string) => Promise<Uint8Array>;
  getMediaUrl: (mediaId: string) => Promise<string>;
}

export class HttpService implements IHttpService {
  constructor(private readonly logger: Logger, private readonly httpClient: AxiosInstance) {
  }

  getMediaUrl(mediaId: string): Promise<string> {
    this.logger.info({ mediaId }, LoggerMessages.GetMediaUrl);
    return this.httpClient.get(`${Urls.GraphURL}${mediaId}`)
      .then(response => (response.data.url as string))
      .catch(error => {
        this.logger.error({ error: error.response }, LoggerMessages.GetMediaUrlError);
        throw error;
      });
  }

  downloadFile(url: string): Promise<Uint8Array> {
    this.logger.info(url, LoggerMessages.DownloadFile);
    return this.httpClient.get(url, { responseType: 'arraybuffer' })
      .then(response => (response.data as Uint8Array))
      .catch(error => {
        this.logger.error({ error: error.data }, LoggerMessages.DownloadFileError);
        throw error;
      });
  }


}
