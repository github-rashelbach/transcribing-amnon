import { APIGatewayEvent, Handler } from 'aws-lambda';
import { createLogger, LoggerMessages } from '../services/logger';
import { LambdaResponder } from '../utils/lambda-responder';


export const handle: Handler<APIGatewayEvent> = async (event, context) => {
  const logger = createLogger(event, context);
  logger.info(event, LoggerMessages.TwilioIncomingMessage);
  return LambdaResponder.success({ event });
};
