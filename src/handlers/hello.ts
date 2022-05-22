import { Handler } from 'aws-lambda';
import { Responder } from '../utils/responder';

export const hello: Handler = async () => {
  return Responder.success<{ data: number }>({
    data: 55,
  });
};
