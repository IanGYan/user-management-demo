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
 * Logging interceptor to track request/response details
 * for monitoring and debugging purposes
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
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
      catchError((error) => {
        const responseTime = Date.now() - now;
        const errorLog = this.buildErrorLog(
          request,
          requestId,
          responseTime,
          error,
        );

        this.logger.error(
          `Request Error: ${request.method} ${request.url} - ${responseTime}ms`,
          error.stack,
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
  private buildRequestLog(request: Request, requestId: string) {
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
  ) {
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
    error: any,
  ) {
    return {
      requestId,
      method: request.method,
      url: request.url,
      responseTime: `${responseTime}ms`,
      error: error.message || 'Unknown error',
      ip: request.ip || 'Unknown',
    };
  }
}
