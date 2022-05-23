import { APIGatewayEvent, Handler } from 'aws-lambda';
import { createLogger, LoggerMessages } from '../services/logger';
import { Responder } from '../utils/responder';
import { WhatsappMessagePayload } from '../external-types/whatsapp';

export const handle: Handler<APIGatewayEvent> = async (event, context) => {
  const logger = createLogger(event, context);
  if (event.body) {
    const whatsAppPayload: WhatsappMessagePayload = JSON.parse(event.body);
    logger.info(whatsAppPayload, LoggerMessages.IncomingMessage);
    return Responder.success({ whatsAppPayload });
  }
  return Responder.error(1000, 'Could not response with body');
};
