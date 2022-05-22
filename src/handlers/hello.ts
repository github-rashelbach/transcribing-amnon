import { Handler } from 'aws-lambda';
import { MessageUtils } from '../utils/message';

export const hello: Handler = async () => {
  return MessageUtils.success<{ data: number }>({
    data: 55,
  });
};
