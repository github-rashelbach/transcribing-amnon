import { SQSHandler } from 'aws-lambda';
import { createLogger } from '../services/logger';

export const handle: SQSHandler = async (event, context) => {
  const logger = createLogger(event, context);
  logger.info({event}, 'bi-writer')
};
