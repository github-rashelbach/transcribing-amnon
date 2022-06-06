import { Handler } from 'aws-lambda';
import { APIGatewayProxyEventV2 } from 'aws-lambda/trigger/api-gateway-proxy';
import { createLogger, LoggerMessages } from '../services/logger';
import { HttpService } from '../services/http';
import { Duplex } from 'stream';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import { LambdaResponder } from '../utils/lambda-responder';

export const handle: Handler<APIGatewayProxyEventV2> = async (event, context) => {
  const logger = createLogger(event, context);
  const httpService = new HttpService(logger);
  logger.info({ event }, LoggerMessages.CloudApiIncomingMessage);
  const message = JSON.parse(event.body!);
  const url = await httpService.getMediaUrl(message.mediaId);
  const bytes = await httpService.downloadFile(url);
  const stream = new Duplex()
  stream.push(bytes);
  stream.push(null);
  const duration = await getAudioDurationInSeconds(stream);
  return LambdaResponder.success(JSON.stringify({ duration }));
};
