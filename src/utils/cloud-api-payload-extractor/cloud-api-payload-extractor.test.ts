/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { WhatsAppPayloadFixtures } from '../../../test/fixtures/whatsapp-payload.fixture';
import { AudioMessageFixtures } from '../../../test/fixtures/audio-message.fixture';
import { CloudApiPayloadExtractor, MessageTypes } from './cloud-api-payload-extractor';

describe('[cloud-api-payload-extractor]', () => {
  describe('Incomplete data', () => {
    it('should return null if payload with empty entry', async () => {
      const payload = WhatsAppPayloadFixtures.valid();
      payload.entry = [];
      const payloadExtractor = new CloudApiPayloadExtractor(payload);
      expect(payloadExtractor.message).toEqual(null);
    });

    it('should return null if payload without entry', async () => {
      const payload = WhatsAppPayloadFixtures.valid({ entry: null });
      const payloadExtractor = new CloudApiPayloadExtractor(payload);
      expect(payloadExtractor.message).toEqual(null);
    });

    it('should return null if changes is empty', async () => {
      const payload = WhatsAppPayloadFixtures.valid();
      payload.entry![0].changes = [];
      const payloadExtractor = new CloudApiPayloadExtractor(payload);
      expect(payloadExtractor.message).toEqual(null);
    });

    it('should return null if payload without changes', async () => {
      const payload = WhatsAppPayloadFixtures.valid({ entry: [{ changes: null }] });
      const payloadExtractor = new CloudApiPayloadExtractor(payload);
      expect(payloadExtractor.message).toEqual(null);
    });

    it('should return null if payload without value in changes', async () => {
      const payload = WhatsAppPayloadFixtures.valid();
      payload.entry![0].changes![0].value = null;
      const payloadExtractor = new CloudApiPayloadExtractor(payload);
      expect(payloadExtractor.message).toEqual(null);
    });
  });
  describe('Message type', () => {
    it('should return audio if message is a audio message', async () => {
      const payload = WhatsAppPayloadFixtures.validWithMessage(AudioMessageFixtures.valid());
      const payloadExtractor = new CloudApiPayloadExtractor(payload);
      expect(payloadExtractor.messageType).toEqual(MessageTypes.Audio);
    });
    it('should return null if type is not defined', async () => {
      const messageWithTypeUnknown = AudioMessageFixtures.valid({ type: 'unknown' } as any);
      const payload = WhatsAppPayloadFixtures.validWithMessage(messageWithTypeUnknown);
      const payloadExtractor = new CloudApiPayloadExtractor(payload);
      expect(payloadExtractor.messageType).toBeNull();
    });
  });
  describe('Message metadata Extractor', () => {
    it('should extract phone number id', async () => {
      const phoneNumberId = 'phoneNumberId';
      const payload = WhatsAppPayloadFixtures.valid({entry: [{changes: [{value: {metadata: {phone_number_id: phoneNumberId}}}]}]});
      const payloadExtractor = new CloudApiPayloadExtractor(payload);
      expect(payloadExtractor.phoneNumberId).toEqual(phoneNumberId);
    });
  });
});
