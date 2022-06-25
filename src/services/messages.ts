import { MessageDomain, MessageTypeDomain, TranscriptionStatusDomain } from '../model/message';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { Logger } from 'pino';
import { LoggerMessages } from './logger';
import { marshall } from '@aws-sdk/util-dynamodb';

interface InsertIncomingMessageParams {
  userId: string;
  createdAt: string;
  type: MessageTypeDomain;
  transcriptionStatus: TranscriptionStatusDomain;
  duration: number;
  content: string | null;

}

export class MessagesService {
  constructor(private readonly dbClient: DynamoDBClient,
              private readonly logger: Logger,
              private readonly messagesTableName: string = process.env.MESSAGES_TABLE!,
  ) {
  }

  insertIncomingMessage(params: InsertIncomingMessageParams) {
    const { userId, type, ...rest } = params;
    const messageDomain: MessageDomain = {
      userIdMessageType: `${userId}#${type}`,
      ...rest
    };
    this.logger.info({ params }, LoggerMessages.AddingMessage);
    const cmd = new PutItemCommand({
        TableName: this.messagesTableName,
        Item: marshall(messageDomain),

      }
    );
    return this.dbClient.send(cmd);
  }
}
