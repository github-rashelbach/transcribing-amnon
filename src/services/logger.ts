import pino from 'pino';
import { lambdaRequestTracker, pinoLambdaDestination } from 'pino-lambda';
import { APIGatewayEvent, Context } from 'aws-lambda';

export enum LoggerMessages {
  CloudApiVerifyWebhook = 'CloudApiVerifyWebhook',
  CloudApiIncomingMessage = 'CloudApiIncomingMessage',
  TwilioIncomingMessage = 'TwilioIncomingMessage',
  GoogleSpeechToTextResponse = 'GoogleSpeechToTextResponse',
  DownloadFile = 'DownloadFile',
  DownloadFileError = 'DownloadFileError',
  GetMediaUrl = 'GetMediaUrl',
  MediaURL = 'MediaURL',
  GetMediaUrlError = 'GetMediaUrlError',
  ReceivedTextMessage = 'ReceivedTextMessage',
  TranscriptionSuccess = 'TranscriptionSuccess',
}

export const createLogger = (event: APIGatewayEvent, context: Context) => {
  const destination = pinoLambdaDestination();
  lambdaRequestTracker()(event, context);
  return pino({}, destination);
};
