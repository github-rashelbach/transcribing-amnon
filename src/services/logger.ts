import pino from 'pino';
import { lambdaRequestTracker, pinoLambdaDestination } from 'pino-lambda';
import { Context } from 'aws-lambda';

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
  DownloadFileSuccess = 'DownloadFileSuccess',
  GetMediaUrl = 'GetMediaUrl',
  MediaURL = 'MediaURL',
  GetMediaUrlError = 'GetMediaUrlError',
  CouldNotGetAudioFromAudioMessage = 'CouldNotGetAudioFromAudioMessage',
  AudioHandler = 'AudioHandler',
  ReceivedTextMessage = 'ReceivedTextMessage',
  TranscriptionSuccess = 'TranscriptionSuccess',
  ReplyingToMessage = 'ReplyingToMessage',
  CouldNotTranscribe = 'CouldNotTranscribe',
  TimeLimit = 'TimeLimit',
  ReceivedUnsupportedMessage = 'ReceivedUnsupportedMessage',
  UnsupportedMessageType = 'UnsupportedMessageType',
  NotifyRequest = 'NotifyRequest',
}

export const createLogger = (event: any, context: Context) => {
  const destination = pinoLambdaDestination();
  lambdaRequestTracker()(event, context);
  return pino({}, destination);
};


