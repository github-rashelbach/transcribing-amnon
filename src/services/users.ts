import {
  DynamoDBClient,
  GetItemCommand, PutItemCommand,
  UpdateItemCommand
} from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { UsageDomain } from '../model/user';

export class UsersService {
  constructor(private readonly dbClient: DynamoDBClient, private readonly usersTableName: string = process.env.USERS_TABLE!) {
  }

  async updateUserUsage(userId: string, usage: UsageDomain) {
    const { Item: user } = await this.dbClient.send(new GetItemCommand({
      TableName: this.usersTableName,
      Key: marshall(userId),
    }));
    return user ?
      this.handleUserExist(userId, usage) :
      this.handleUserNotExist(userId, usage);
  }

  private handleUserExist(userId: string, usage: UsageDomain) {
    const updateItemCommand = new UpdateItemCommand({
      Key: marshall(userId),
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
    return this.dbClient.send(updateItemCommand);
  }

  private handleUserNotExist(userId: string, usage: UsageDomain) {
    const putItemCommand = new PutItemCommand({
      TableName: this.usersTableName,
      Item: marshall({ userId, usages: [usage] }),
    });

    return this.dbClient.send(putItemCommand);

  }

}
