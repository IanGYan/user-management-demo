import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiErrorResponse } from '../types/api-response.type';

/**
 * HTTP异常响应对象接口
 */
interface HttpExceptionResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

/**
 * 类型保护：检查是否为HTTP异常响应对象
 */
function isHttpExceptionResponse(obj: unknown): obj is HttpExceptionResponse {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    ('message' in obj || 'error' in obj || 'statusCode' in obj)
  );
}

/**
 * Global exception filter to handle all HTTP exceptions
 * and format error responses consistently
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = this.getHttpStatus(exception);
    const message = this.getErrorMessage(exception);

    const errorResponse: ApiErrorResponse = {
      success: false,
      message,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Log error details for monitoring
    this.logError(exception, request);

    response.status(status).json(errorResponse);
  }

  /**
   * Extracts HTTP status code from the exception
   */
  private getHttpStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  /**
   * Extracts error message from the exception
   */
  private getErrorMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'string') {
        return response;
      }
      if (isHttpExceptionResponse(response)) {
        if (response.message) {
          return Array.isArray(response.message)
            ? response.message.join(', ')
            : response.message;
        }
      }
    }

    if (exception instanceof Error) {
      return exception.message;
    }

    return '服务器内部错误';
  }

  /**
   * Logs error details for monitoring and debugging
   */
  private logError(exception: unknown, request: Request): void {
    const status = this.getHttpStatus(exception);
    const message = this.getErrorMessage(exception);

    const errorLog = {
      method: request.method,
      url: request.url,
      status,
      message,
      userAgent: request.get('User-Agent') || 'Unknown',
      ip: request.ip || 'Unknown',
    };

    if (status >= 500) {
      this.logger.error(
        `Internal Server Error: ${message}`,
        exception instanceof Error
          ? exception.stack
          : JSON.stringify(exception),
        errorLog,
      );
    } else {
      this.logger.warn(`Client Error: ${message}`, errorLog);
    }
  }
}
