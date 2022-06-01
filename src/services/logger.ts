import pino from 'pino';
import { lambdaRequestTracker, pinoLambdaDestination } from 'pino-lambda';
import { Context } from 'aws-lambda';
import { APIGatewayProxyEventV2 } from 'aws-lambda/trigger/api-gateway-proxy';

export enum LoggerMessages {
  CloudApiVerifyWebhook = 'CloudApiVerifyWebhook',
  CloudApiIncomingMessage = 'CloudApiIncomingMessage',
  WhatsappPayload = 'WhatsappPayload',
  NoHandlerForTypeOfMessage = 'NoHandlerForTypeOfMessage',
  TwilioIncomingMessage = 'TwilioIncomingMessage',
  GoogleSpeechToTextResponse = 'GoogleSpeechToTextResponse',
  DownloadFile = 'DownloadFile',
  SendMessage = 'SendMessage',
  SendMessageSuccess = 'SendMessageSuccess',
  SendMessageError = 'SendMessageError',
  DownloadFileError = 'DownloadFileError',
  GetMediaUrl = 'GetMediaUrl',
  MediaURL = 'MediaURL',
  GetMediaUrlError = 'GetMediaUrlError',
  CouldNotGetAudioFromAudioMessage = 'CouldNotGetAudioFromAudioMessage',
  ReceivedTextMessage = 'ReceivedTextMessage',
  TranscriptionSuccess = 'TranscriptionSuccess',
  ReplyingToMessage = 'ReplyingToMessage',
}

export const createLogger = (event: APIGatewayProxyEventV2, context: Context) => {
  const destination = pinoLambdaDestination();
  lambdaRequestTracker()(event, context);
  return pino({}, destination);
};


