import { StatusCodes } from 'http-status-codes';

export interface ApiGatewayResponse {
  statusCode: number;
  body: string;
}

export class LambdaResponder {
  static success(body: string): ApiGatewayResponse {
    return {
      statusCode: StatusCodes.OK,
      body
    }
  }

  static error(code: StatusCodes, message: string) {
    return {
      statusCode: code,
      body: message
    }
  }
}
