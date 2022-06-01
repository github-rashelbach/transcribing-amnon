/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { WhatsAppPayloadFixtures } from '../../../test/fixtures/whatsapp-payload.fixture';
import { AudioMessageFixtures } from '../../../test/fixtures/audio-message.fixture';
import { CloudApiPayloadExtractor, MessageTypes } from './cloud-api-payload-extractor';
import { FacebookAudioRecording } from '../../types';
import { TextMessageFixtures } from '../../../test/fixtures/text-mesage-fixture';

describe('[cloud-api-payload-extractor]', () => {
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
      const payloadExtractor = new CloudApiPayloadExtractor(payload);
      expect(payloadExtractor.getAudioData()).toEqual<FacebookAudioRecording>({
        messageId,
        mediaId,
        senderId,
        timestamp: audioMessageOverride.timestamp,
      });
    });

    it('should return null if type is not audio', async () => {
      const payload = WhatsAppPayloadFixtures.validWithMessage(TextMessageFixtures.valid());
      const payloadExtractor = new CloudApiPayloadExtractor(payload);
      expect(payloadExtractor.getAudioData()).toBeNull();
    });
  });
  describe('Text Extractor', () => {
    it('should extract text if type is text', async () => {
      const text = 'Hello'
      const messageOverride = TextMessageFixtures.valid({text: {body:text}});
      const payload = WhatsAppPayloadFixtures.validWithMessage(messageOverride);
      const payloadExtractor = new CloudApiPayloadExtractor(payload);
      expect(payloadExtractor.getText()).toEqual(text);
    });

    it('should return null if type is not audio', async () => {
      const payload = WhatsAppPayloadFixtures.validWithMessage(AudioMessageFixtures.valid());
      const payloadExtractor = new CloudApiPayloadExtractor(payload);
      expect(payloadExtractor.getText()).toBeNull();
    });


  });
  describe('Incomplete data', () => {
    it('should return null if payload with empty entry', async () => {
      const payload = WhatsAppPayloadFixtures.valid();
      payload.entry = [];
      const payloadExtractor = new CloudApiPayloadExtractor(payload);
      expect(payloadExtractor.getAudioData()).toEqual(null);
    });

    it('should return null if payload without entry', async () => {
      const payload = WhatsAppPayloadFixtures.valid({ entry: null });
      const payloadExtractor = new CloudApiPayloadExtractor(payload);
      expect(payloadExtractor.getAudioData()).toEqual(null);
    });

    it('should return null if changes is empty', async () => {
      const payload = WhatsAppPayloadFixtures.valid();
      payload.entry![0].changes = [];
      const payloadExtractor = new CloudApiPayloadExtractor(payload);
      expect(payloadExtractor.getAudioData()).toEqual(null);
    });

    it('should return null if payload without changes', async () => {
      const payload = WhatsAppPayloadFixtures.valid({ entry: [{ changes: null }] });
      const payloadExtractor = new CloudApiPayloadExtractor(payload);
      expect(payloadExtractor.getAudioData()).toEqual(null);
    });

    it('should return null if payload without value in changes', async () => {
      const payload = WhatsAppPayloadFixtures.valid();
      payload.entry![0].changes![0].value = null;
      const payloadExtractor = new CloudApiPayloadExtractor(payload);
      expect(payloadExtractor.getAudioData()).toEqual(null);
    });
  });
  describe('Message type', () => {
    it('should return audio if message is a audio message', async () => {
      const payload = WhatsAppPayloadFixtures.validWithMessage(AudioMessageFixtures.valid());
      const payloadExtractor = new CloudApiPayloadExtractor(payload);
      expect(payloadExtractor.getMessageType()).toEqual(MessageTypes.Audio);
    });
    it('should return null if type is not defined', async () => {
      const messageWithTypeUnknown = AudioMessageFixtures.valid({ type: 'unknown' } as any);
      const payload = WhatsAppPayloadFixtures.validWithMessage(messageWithTypeUnknown);
      const payloadExtractor = new CloudApiPayloadExtractor(payload);
      expect(payloadExtractor.getMessageType()).toBeNull();
    });
  });
  describe('Message metadata Extractor', () => {
    it('should extract phone number id', async () => {
      const phoneNumberId = 'phoneNumberId';
      const payload = WhatsAppPayloadFixtures.valid({entry: [{changes: [{value: {metadata: {phone_number_id: phoneNumberId}}}]}]});
      const payloadExtractor = new CloudApiPayloadExtractor(payload);
      expect(payloadExtractor.getPhoneNumberId()).toEqual(phoneNumberId);
    });
  });
});
