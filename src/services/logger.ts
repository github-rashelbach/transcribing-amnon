import pino from 'pino';
import { lambdaRequestTracker, pinoLambdaDestination } from 'pino-lambda';
import { APIGatewayEvent, Context } from 'aws-lambda';

export enum LoggerMessages {
  CloudApiIncomingMessage = 'CloudApiIncomingMessage',
  TwilioIncomingMessage = 'TwilioIncomingMessage',
  GoogleSpeechToTextResponse = 'GoogleSpeechToTextResponse',
  DownloadFile = 'DownloadFile',
  DownloadFileError = 'DownloadFileError',
}

export const createLogger = (event: APIGatewayEvent, context: Context) => {
  const destination = pinoLambdaDestination();
  lambdaRequestTracker()(event, context);
  return pino({}, destination);
};
