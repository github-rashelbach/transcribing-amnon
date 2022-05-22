import { TextMessage } from '../../src/external-types/messages';
import { MessageBody } from '../../src/external-types/whatsapp';
import { overridable } from './overridable';

const defaultTextMessage: () => MessageBody & TextMessage = () => ({
  from: '972544412113',
  id: 'wamid.HBgMOTcyNaTQd0NDEdMTsEyFsI5EhgU6EcEND3YxQTkddMURDNjFBQTgA',
  timestamp: '1653163666',
  type: 'text',
  text: {
    body: 'Shalom',
  },
});

export const TextMessageFixtures = {
  valid: overridable(() => defaultTextMessage()),
};
