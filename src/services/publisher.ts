import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { WhatsappMessagePayload } from '../external-types/whatsapp';
import { NotifyMessage } from '../types';

export interface IPublisher {
  publishToTranscriptionQueue(message: WhatsappMessagePayload): Promise<void>;
}

const REGION = process.env.AWS_REGION || 'us-east-1';

const QueueUrls = {
  TranscriptionQueue: process.env.TRANSCRIPTION_REQUEST_QUEUE_URL!,
  NotificationsQueue: process.env.NOTIFICATIONS_QUEUE_URL!,
};

export class Publisher implements IPublisher {
  constructor(private readonly sqsClient = new SQSClient({ region: REGION })) {
  }

  private async notify(message: string, queueUrl: string) {
    const command = new SendMessageCommand({
      MessageBody: message,
      QueueUrl: queueUrl,
    });
    await this.sqsClient.send(command);
  }

  public async publishToTranscriptionQueue(message: WhatsappMessagePayload): Promise<void> {
    return this.notify(JSON.stringify(message), QueueUrls.TranscriptionQueue);
  }

  public publishToNotificationQueue(message: NotifyMessage): Promise<void> {
    return this.notify(JSON.stringify(message), QueueUrls.TranscriptionQueue);
  }
}
