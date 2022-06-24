import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export const createDynamoDBClient = (): DynamoDBClient => {
  return new DynamoDBClient({ region: process.env.REGION });
};
