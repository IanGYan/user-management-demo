import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiErrorResponse } from '../types/api-response.type';

/**
 * Exception filter specifically for handling validation errors
 * and formatting them with detailed field-level error messages
 */
@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ValidationExceptionFilter.name);

  catch(exception: BadRequestException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    const errorResponse: ApiErrorResponse = {
      success: false,
      message: this.formatValidationMessage(exceptionResponse),
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Log validation errors for monitoring
    this.logger.warn('Validation Error', {
      method: request.method,
      url: request.url,
      errors: exceptionResponse.message,
      ip: request.ip || 'Unknown',
    });

    response.status(status).json(errorResponse);
  }

  /**
   * Formats validation error messages for better user experience
   */
  private formatValidationMessage(exceptionResponse: any): string {
    if (exceptionResponse.message && Array.isArray(exceptionResponse.message)) {
      // Join multiple validation errors with semicolons
      return exceptionResponse.message.join('; ');
    }

    if (typeof exceptionResponse.message === 'string') {
      return exceptionResponse.message;
    }

    return '请求数据验证失败';
  }
}
