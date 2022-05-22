import { MessageBody, WhatsappMessagePayload } from '../../src/external-types/whatsapp';
import { overridable } from './overridable';

const defaultWhatsAppPayload = (): WhatsappMessagePayload => ({
  object: 'whatsapp_business_account',
  entry: [
    {
      id: '115501034496010',
      changes: [
        {
          value: {
            messaging_product: 'whatsapp',
            metadata: {
              display_phone_number: '15550501218',
              phone_number_id: '101389552592331',
            },
            contacts: [
              {
                profile: {
                  name: 'Shilo Magen',
                },
                wa_id: '972544412112',
              },
            ],
            messages: [
              {
                from: '972544412112',
                id: 'wamid.HBgMOTcyNTQ0NDEyMTEyFQIAEhgUM0EyRENDMkYxQTkwMURDNjFBQTgA',
                timestamp: '1653163666',
                type: 'audio',
                audio: {
                  mime_type: 'audio/ogg; codecs=opus',
                  sha256: 'j2208y7H0SVDcj1ibZ5NtkdUWRvYAQgrTu23GDLizW8=',
                  id: '378008607617054',
                  voice: true,
                },
              },
            ],
          },
          field: 'messages',
        },
      ],
    },
  ],
});
export const WhatsAppPayloadFixtures = {
  validWithMessage: (message: MessageBody) =>
    overridable(() => defaultWhatsAppPayload())({ entry: [{ changes: [{ value: { messages: [message] } }] }] }),
  valid: overridable(() => defaultWhatsAppPayload()),
};
