import pino from 'pino';
import { lambdaRequestTracker, pinoLambdaDestination } from 'pino-lambda';
import { Context } from 'aws-lambda';
import { APIGatewayProxyEventV2 } from 'aws-lambda/trigger/api-gateway-proxy';

export enum LoggerMessages {
  CloudApiVerifyWebhook = 'CloudApiVerifyWebhook',
  CloudApiIncomingMessage = 'CloudApiIncomingMessage',
  WhatsappPayload = 'WhatsappPayload',
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

export const createLogger = (event: APIGatewayProxyEventV2, context: Context) => {
  const destination = pinoLambdaDestination();
  lambdaRequestTracker()(event, context);
  return pino({}, destination);
};


