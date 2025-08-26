import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';
import { ApiResponse } from '../types/api-response.type';

/**
 * Global response interceptor to standardize API response format
 * and add consistent logging for successful requests
 */
@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  private readonly logger = new Logger(ResponseInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const now = Date.now();

    return next.handle().pipe(
      map((data) => {
        const responseTime = Date.now() - now;

        // Log successful requests for monitoring
        this.logSuccessfulRequest(request, responseTime);

        return this.formatResponse(data);
      }),
    );
  }

  /**
   * Formats the response data into standardized API response format
   */
  private formatResponse<T>(data: T): ApiResponse<T> {
    // If data is already in ApiResponse format, return as is
    if (this.isApiResponse(data)) {
      return data as ApiResponse<T>;
    }

    // If data is null or undefined, return success response without data
    if (data === null || data === undefined) {
      return {
        success: true,
        message: '操作成功',
      };
    }

    // For regular data, wrap in standard response format
    return {
      success: true,
      data,
    };
  }

  /**
   * Checks if the data is already in ApiResponse format
   */
  private isApiResponse(data: any): boolean {
    return (
      data && typeof data === 'object' && typeof data.success === 'boolean'
    );
  }

  /**
   * Logs successful request details for monitoring
   */
  private logSuccessfulRequest(request: Request, responseTime: number): void {
    const logData = {
      method: request.method,
      url: request.url,
      responseTime: `${responseTime}ms`,
      userAgent: request.get('User-Agent') || 'Unknown',
      ip: request.ip || 'Unknown',
    };

    this.logger.log(
      `${request.method} ${request.url} - ${responseTime}ms`,
      logData,
    );
  }
}
