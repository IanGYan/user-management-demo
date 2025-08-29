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
 * 验证异常响应对象接口
 */
interface ValidationExceptionResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

/**
 * 类型保护：检查是否为验证异常响应对象
 */
function isValidationExceptionResponse(
  obj: unknown,
): obj is ValidationExceptionResponse {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    ('message' in obj || 'error' in obj || 'statusCode' in obj)
  );
}

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
    const exceptionResponse = exception.getResponse();

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
      errors: isValidationExceptionResponse(exceptionResponse)
        ? exceptionResponse.message
        : 'Unknown validation error',
      ip: request.ip || 'Unknown',
    });

    response.status(status).json(errorResponse);
  }

  /**
   * Formats validation error messages for better user experience
   */
  private formatValidationMessage(exceptionResponse: unknown): string {
    if (!isValidationExceptionResponse(exceptionResponse)) {
      return '请求数据验证失败';
    }

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
