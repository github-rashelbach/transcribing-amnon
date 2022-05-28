import { APIGatewayEvent, Handler } from 'aws-lambda';
import { createLogger, LoggerMessages } from '../services/logger';
import { LambdaResponder } from '../utils/lambda-responder';
import { WhatsappMessagePayload } from '../external-types/whatsapp';

export const cloudApiHandler: Handler<APIGatewayEvent> = async (event, context) => {
  const logger = createLogger(event, context);
  if (event.body) {
    const whatsAppPayload: WhatsappMessagePayload = JSON.parse(event.body);
    logger.info(whatsAppPayload, LoggerMessages.CloudApiIncomingMessage);
    return LambdaResponder.success({ whatsAppPayload });
  }
  return LambdaResponder.error(1000, 'Could not response with body');
};
