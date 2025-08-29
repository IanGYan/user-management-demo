import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';
import { throwError } from 'rxjs';

/**
 * Error interface for type safety
 */
interface ErrorWithStack {
  message?: string;
  stack?: string;
  [key: string]: unknown;
}

/**
 * Type guard to check if object has error properties
 */
function isErrorWithStack(error: unknown): error is ErrorWithStack {
  return (
    error !== null &&
    typeof error === 'object' &&
    ('message' in error || 'stack' in error)
  );
}

/**
 * Logging interceptor to track request/response details
 * for monitoring and debugging purposes
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const now = Date.now();

    const requestId = this.generateRequestId();
    const requestLog = this.buildRequestLog(request, requestId);

    // Log incoming request
    this.logger.log(
      `Incoming Request: ${request.method} ${request.url}`,
      requestLog,
    );

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now;
        const responseLog = this.buildResponseLog(
          request,
          response,
          requestId,
          responseTime,
        );

        this.logger.log(
          `Outgoing Response: ${response.statusCode} - ${responseTime}ms`,
          responseLog,
        );
      }),
      catchError((error: unknown) => {
        const responseTime = Date.now() - now;
        const errorLog = this.buildErrorLog(
          request,
          requestId,
          responseTime,
          error,
        );

        const errorStack = isErrorWithStack(error) ? error.stack : undefined;
        this.logger.error(
          `Request Error: ${request.method} ${request.url} - ${responseTime}ms`,
          errorStack,
          errorLog,
        );

        return throwError(() => error);
      }),
    );
  }

  /**
   * Generates a unique request ID for tracking
   */
  private generateRequestId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   * Builds log data for incoming requests
   */
  private buildRequestLog(
    request: Request,
    requestId: string,
  ): Record<string, string> {
    return {
      requestId,
      method: request.method,
      url: request.url,
      userAgent: request.get('User-Agent') || 'Unknown',
      ip: request.ip || 'Unknown',
      contentType: request.get('Content-Type') || 'Unknown',
      contentLength: request.get('Content-Length') || '0',
    };
  }

  /**
   * Builds log data for successful responses
   */
  private buildResponseLog(
    request: Request,
    response: Response,
    requestId: string,
    responseTime: number,
  ): Record<string, string | number> {
    return {
      requestId,
      method: request.method,
      url: request.url,
      statusCode: response.statusCode,
      responseTime: `${responseTime}ms`,
      ip: request.ip || 'Unknown',
    };
  }

  /**
   * Builds log data for error responses
   */
  private buildErrorLog(
    request: Request,
    requestId: string,
    responseTime: number,
    error: unknown,
  ): Record<string, string> {
    const errorMessage =
      isErrorWithStack(error) && error.message
        ? error.message
        : 'Unknown error';

    return {
      requestId,
      method: request.method,
      url: request.url,
      responseTime: `${responseTime}ms`,
      error: errorMessage,
      ip: request.ip || 'Unknown',
    };
  }
}
