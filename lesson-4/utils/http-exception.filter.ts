import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const res = context.getResponse();
    const status = exception.getStatus();
    const message = exception.message;

    res.status(status).json({
      message,
      statusCode: status,
      time: new Date().toISOString(),
    });
  }
}
