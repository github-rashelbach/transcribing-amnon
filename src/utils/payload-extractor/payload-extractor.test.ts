/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { WhatsAppPayloadFixtures } from '../../../test/fixtures/whatsapp-payload.fixture';
import { AudioMessageFixtures } from '../../../test/fixtures/audio-message.fixture';
import { PayloadExtractor } from './payload-extractor';
import { AudioRecording } from '../../types';
import { TextMessageFixtures } from '../../../test/fixtures/text-mesage-fixture';

describe('[payload-extractor]', () => {
  describe('Audio Extractor', () => {
    it('should extract audio if type is audio', async () => {
      const messageId = 'messageId';
      const mediaId = 'audioId';
      const senderId = 'sender123';
      const audioMessageOverride = AudioMessageFixtures.valid({
        id: messageId,
        audio: { id: mediaId },
        from: senderId,
      });
      const payload = WhatsAppPayloadFixtures.validWithMessage(audioMessageOverride);
      const payloadExtractor = new PayloadExtractor(payload);
      expect(payloadExtractor.getAudioData()).toEqual<AudioRecording>({
        messageId,
        mediaId,
        senderId,
        timestamp: audioMessageOverride.timestamp,
      });
    });

    it('should return null if type is not audio', async () => {
      const payload = WhatsAppPayloadFixtures.validWithMessage(TextMessageFixtures.valid());
      const payloadExtractor = new PayloadExtractor(payload);
      expect(payloadExtractor.getAudioData()).toBeNull();
    });
  });
  describe('Incomplete data', () => {
    it('should return null if payload with empty entry', async () => {
      const payload = WhatsAppPayloadFixtures.valid();
      payload.entry = [];
      const payloadExtractor = new PayloadExtractor(payload);
      expect(payloadExtractor.getAudioData()).toEqual(null);
    });

    it('should return null if payload without entry', async () => {
      const payload = WhatsAppPayloadFixtures.valid({ entry: null });
      const payloadExtractor = new PayloadExtractor(payload);
      expect(payloadExtractor.getAudioData()).toEqual(null);
    });

    it('should return null if changes is empty', async () => {
      const payload = WhatsAppPayloadFixtures.valid();
      payload.entry![0].changes = [];
      const payloadExtractor = new PayloadExtractor(payload);
      expect(payloadExtractor.getAudioData()).toEqual(null);
    });

    it('should return null if payload without changes', async () => {
      const payload = WhatsAppPayloadFixtures.valid({ entry: [{ changes: null }] });
      const payloadExtractor = new PayloadExtractor(payload);
      expect(payloadExtractor.getAudioData()).toEqual(null);
    });

    it('should return null if payload without value in changes', async () => {
      const payload = WhatsAppPayloadFixtures.valid();
      payload.entry![0].changes![0].value = null;
      const payloadExtractor = new PayloadExtractor(payload);
      expect(payloadExtractor.getAudioData()).toEqual(null);
    });
  });
});
