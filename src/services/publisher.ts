import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { WhatsappMessagePayload } from '../external-types/whatsapp';

export interface IPublisher {
  publishToTranscriptionQueue(message: WhatsappMessagePayload): Promise<void>;
}

const REGION = process.env.AWS_REGION || 'us-east-1';

const QueueUrls = {
  TranscriptionQueue: process.env.TRANSCRIPTION_REQUEST_QUEUE_URL!,
};

export class Publisher implements IPublisher {
  constructor(private readonly sqsClient = new SQSClient({ region: REGION })) {
  }

  public async publishToTranscriptionQueue(message: WhatsappMessagePayload): Promise<void> {
    const data = JSON.stringify(message);
    const command = new SendMessageCommand({
      MessageBody: data,
      QueueUrl: QueueUrls.TranscriptionQueue,
    });
    await this.sqsClient.send(command);

  }
}
