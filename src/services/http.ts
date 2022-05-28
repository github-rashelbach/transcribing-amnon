import { Logger } from 'pino';
import { AxiosInstance } from 'axios';
import { LoggerMessages } from './logger';

export interface IHttpService {
  downloadFile: (url: string) => Promise<Uint8Array>;
}

export class HttpService implements IHttpService {
  constructor(private readonly logger: Logger, private readonly httpClient: AxiosInstance) {
  }

  downloadFile(url: string): Promise<Uint8Array> {
    this.logger.info(url, LoggerMessages.DownloadFile);
    return this.httpClient.get(url, { responseType: 'arraybuffer' })
      .then(response => (response.data as Uint8Array))
      .catch(error => {
        this.logger.error(error.data, LoggerMessages.DownloadFileError);
        throw error;
      });
  }

}
