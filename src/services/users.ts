import {
  DynamoDBClient,
  GetItemCommand, PutItemCommand,
  UpdateItemCommand
} from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { Logger } from 'pino';
import { UsageDomain } from '../model/user';
import { LoggerMessages } from './logger';

export class UsersService {
  constructor(private readonly dbClient: DynamoDBClient,
              private readonly logger: Logger,
              private readonly usersTableName: string = process.env.USERS_TABLE!,
  ) {
  }

  async updateUserUsage(userId: string, usage: UsageDomain) {
    this.logger.info({ userId, usage }, LoggerMessages.StartUpdateUserUsage);
    const { Item: user } = await this.dbClient.send(new GetItemCommand({
      TableName: this.usersTableName,
      Key: marshall({ userId }),

    }));
    return user ?
      this.handleUserExist(userId, usage) :
      this.handleUserNotExist(userId, usage);
  }

  private handleUserExist(userId: string, usage: UsageDomain) {
    const updateItemCommand = new UpdateItemCommand({
      Key: marshall({ userId }),
      TableName: this.usersTableName,
      UpdateExpression: 'SET #usages = list_append(#usages, :usage)',
      ExpressionAttributeNames: {
        '#usages': 'usages'
      },
      ExpressionAttributeValues: {
        ':usage': {
          L: [{ M: marshall(usage) }]
        }
      },
      ReturnValues: 'ALL_NEW'
    });
    this.logger.info({ userId, usage }, LoggerMessages.UpdatedExistingUser);
    return this.dbClient.send(updateItemCommand);
  }

  private handleUserNotExist(userId: string, usage: UsageDomain) {
    const putItemCommand = new PutItemCommand({
      TableName: this.usersTableName,
      Item: marshall({ userId, usages: [usage] }),
    });
    this.logger.info({ userId, usage }, LoggerMessages.UserCreated);
    return this.dbClient.send(putItemCommand);

  }

}
