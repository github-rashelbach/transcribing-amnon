import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { Logger } from 'pino';
import { LoggerMessages } from './logger';
import { UserDomain } from '../model/user';

export class UsersService {
  constructor(private readonly dbClient: DynamoDBClient,
              private readonly logger: Logger,
              private readonly usersTableName: string = process.env.USERS_TABLE!,
  ) {
  }

  async insertUser(userId: string, name: string) {
    const userDomain: UserDomain = { userId, name };
    this.logger.info({ userId, name }, LoggerMessages.CreatingUser);
    return this.dbClient.send(new PutItemCommand({
      TableName: this.usersTableName,
      Item: marshall(userDomain),
    }));
  }
}
