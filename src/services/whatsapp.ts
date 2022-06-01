import { IHttpService } from './http';
import { OutgoingTextMessage } from '../external-types/whatsapp';


export class WhatsappService {
  constructor(private readonly httpService: IHttpService) {
  }

  async sendTextMessage(fromId: string, body: string, to: string): Promise<boolean> {
    const message: OutgoingTextMessage = {
      messaging_product: 'whatsapp',
      preview_url: false,
      recipient_type: 'individual',
      type: 'text',
      text: { body },
      to,
    };
    return this.httpService.message(fromId, message)
      .then(() => true)
      .catch(() => false);
  }

}
