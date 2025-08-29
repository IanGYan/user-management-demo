/**
 * Standard API response interface for success responses
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

/**
 * Standard API response interface for error responses
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
  statusCode: number;
  timestamp: string;
  path: string;
}

/**
 * Authentication response with user data and tokens
 */
export interface AuthResponse {
  user: {
    id: string;
    email: string;
    isVerified: boolean;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

/**
 * Token refresh response
 */
export interface TokenRefreshResponse {
  accessToken: string;
}
