export class ApiGatewayResponse {
  statusCode: number;
  body: string;
}

enum StatusCode {
  success = 200,
}

class Result<T> {

  constructor(private readonly statusCode: number,
              private readonly code: number,
              private readonly message: string,
              private readonly data?: T) {
  }

  /**
   * Serverless: According to the API Gateway specs, the body content must be stringified
   */
  bodyToString() {
    return {
      statusCode: this.statusCode,
      body: JSON.stringify({
        code: this.code,
        message: this.message,
        data: this.data,
      }),
    };
  }
}

export class MessageUtils {
  static success<T>(data: T): ApiGatewayResponse {
    const result = new Result<T>(StatusCode.success, 0, 'success', data);
    return result.bodyToString();
  }

  static error(code: number = 1000, message: string) {
    const result = new Result(StatusCode.success, code, message);
    return result.bodyToString();
  }
}
