import { Handler } from 'aws-lambda';
import { MessageUtils } from './src/utils/message';

export const hello: Handler = async (_: any) => {
  return MessageUtils.success<{ data: number }>({
    data: 55
  });
};
