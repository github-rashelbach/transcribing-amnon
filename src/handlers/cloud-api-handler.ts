import { Handler } from 'aws-lambda';
import { createLogger, LoggerMessages } from '../services/logger';
import { LambdaResponder } from '../utils/lambda-responder';
import { Logger } from 'pino';
import { APIGatewayProxyEventV2 } from 'aws-lambda/trigger/api-gateway-proxy';
import { StatusCodes } from 'http-status-codes';
import { Publisher } from '../services/publisher';


export const cloudApiHandler: Handler<APIGatewayProxyEventV2> = async (event, context) => {
  const logger = createLogger(event, context);
  logger.info({ event }, LoggerMessages.CloudApiIncomingMessage);
  const publisher = new Publisher();
  if (event.requestContext.http.method === 'GET') {
    return verifyWebhook(event, logger);
  }
  if (event.body) {
    await publisher.publishToTranscriptionQueue(JSON.parse(event.body));
  }
  return LambdaResponder.success('SUCCESS');
};

const verifyWebhook = (event: APIGatewayProxyEventV2, logger: Logger) => {
  logger.info({ event }, LoggerMessages.CloudApiVerifyWebhook);
  const mode = event.queryStringParameters?.['hub.mode'];
  const token = event.queryStringParameters?.['hub.verify_token'];
  const challenge = event.queryStringParameters?.['hub.challenge'] || '';

  return mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN ?
    LambdaResponder.success(challenge) :
    LambdaResponder.error(StatusCodes.UNAUTHORIZED, 'Could not verify webhook');

};
