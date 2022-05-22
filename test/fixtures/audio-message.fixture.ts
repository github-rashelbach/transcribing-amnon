import { AudioMessage } from '../../src/external-types/messages';
import { MessageBody } from '../../src/external-types/whatsapp';
import { overridable } from './overridable';

const defaultAudioMessage: () => MessageBody & AudioMessage = () => ({
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
});

export const AudioMessageFixtures = {
  valid: overridable(() => defaultAudioMessage()),
};
