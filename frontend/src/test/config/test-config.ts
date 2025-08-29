/**
 * Test configuration and constants
 * Centralized configuration for all tests
 */

// Type definitions for test data
interface TestUser {
  id: string;
  email: string;
  passwordHash?: string;
  isVerified: boolean;
  verificationToken?: string | null;
  verificationTokenExpires?: Date | null;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  failedLoginAttempts?: number;
  lockedUntil?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface TestRefreshToken {
  id: string;
  token: string;
  expiresAt: Date;
  userId: string;
  createdAt: Date;
}

interface TestJwtPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
}

type NodeEnv = 'development' | 'production' | 'test';

export const TEST_CONFIG = {
  // Timeouts
  DEFAULT_TIMEOUT: 10000,
  API_TIMEOUT: 15000,
  RENDER_TIMEOUT: 5000,

  // Test database settings
  DATABASE: {
    TYPE: 'sqlite' as const,
    DATABASE: ':memory:',
    SYNCHRONIZE: true,
    DROP_SCHEMA: true,
    LOGGING: false,
  },

  // JWT settings for testing
  JWT: {
    SECRET: 'test-jwt-secret-key-for-testing',
    REFRESH_SECRET: 'test-refresh-secret-key-for-testing',
    ACCESS_TOKEN_EXPIRES: '30m',
    REFRESH_TOKEN_EXPIRES: '7d',
  },

  // API settings
  API: {
    BASE_URL: 'http://localhost:3001',
    VERSION: 'v1',
    ENDPOINTS: {
      AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        REFRESH: '/auth/refresh',
        LOGOUT: '/auth/logout',
        VERIFY_EMAIL: '/auth/verify-email',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
      },
      USER: {
        PROFILE: '/user/profile',
        UPDATE_PROFILE: '/user/profile',
        CHANGE_PASSWORD: '/user/change-password',
      },
    },
  },

  // Test users
  TEST_USERS: {
    VALID: {
      email: 'test@example.com',
      password: 'ValidPassword123!',
      id: 'test-user-id-1',
    },
    VERIFIED: {
      email: 'verified@example.com',
      password: 'VerifiedPass123!',
      id: 'verified-user-id',
      isVerified: true,
    },
    UNVERIFIED: {
      email: 'unverified@example.com',
      password: 'UnverifiedPass123!',
      id: 'unverified-user-id',
      isVerified: false,
    },
    LOCKED: {
      email: 'locked@example.com',
      password: 'LockedPass123!',
      id: 'locked-user-id',
      isVerified: true,
      failedLoginAttempts: 5,
      lockedUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
    },
  },

  // Validation test data
  VALIDATION: {
    INVALID_EMAILS: [
      '',
      'invalid-email',
      '@domain.com',
      'user@',
      'user..name@domain.com',
      'user name@domain.com',
      'user@domain',
      'a'.repeat(255) + '@domain.com',
    ],
    VALID_EMAILS: [
      'user@example.com',
      'test.email@domain.co.uk',
      'user+tag@example.org',
      'firstname.lastname@company.com',
    ],
    INVALID_PASSWORDS: [
      '',
      '123', // Too short
      'nouppercase123!', // No uppercase
      'NOLOWERCASE123!', // No lowercase
      'NoNumbers!', // No numbers
      'NoSpecialChar123', // No special characters
      'a'.repeat(129), // Too long
    ],
    VALID_PASSWORDS: [
      'ValidPass123!',
      'AnotherGood1@',
      'Complex#Pass99',
      'Secure$2024',
    ],
  },

  // Error messages
  ERROR_MESSAGES: {
    VALIDATION: {
      EMAIL_REQUIRED: 'Email is required',
      EMAIL_INVALID: 'Invalid email format',
      PASSWORD_REQUIRED: 'Password is required',
      PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
      PASSWORD_TOO_WEAK:
        'Password must contain uppercase, lowercase, number and special character',
    },
    AUTH: {
      INVALID_CREDENTIALS: 'Invalid email or password',
      USER_NOT_FOUND: 'User not found',
      EMAIL_ALREADY_EXISTS: 'Email already exists',
      EMAIL_NOT_VERIFIED: 'Email not verified',
      ACCOUNT_LOCKED: 'Account is locked',
      TOKEN_EXPIRED: 'Token has expired',
      TOKEN_INVALID: 'Invalid token',
    },
    NETWORK: {
      CONNECTION_ERROR: 'Network connection error',
      SERVER_ERROR: 'Internal server error',
      TIMEOUT: 'Request timeout',
    },
  },

  // Success messages
  SUCCESS_MESSAGES: {
    AUTH: {
      LOGIN_SUCCESS: 'Login successful',
      REGISTER_SUCCESS: 'Registration successful',
      LOGOUT_SUCCESS: 'Logout successful',
      EMAIL_VERIFIED: 'Email verified successfully',
      PASSWORD_RESET: 'Password reset successful',
    },
    USER: {
      PROFILE_UPDATED: 'Profile updated successfully',
      PASSWORD_CHANGED: 'Password changed successfully',
    },
  },
}

/**
 * Environment-specific test configuration
 */
export const getTestEnvironment = (): typeof TEST_CONFIG => {
  const env = (process.env.NODE_ENV as NodeEnv | 'test:verbose') || 'test';

  switch (env) {
    case 'test':
      return {
        ...TEST_CONFIG,
        DATABASE: {
          ...TEST_CONFIG.DATABASE,
          LOGGING: false,
        },
      };
    case 'test:verbose':
      return {
        ...TEST_CONFIG,
        DATABASE: {
          ...TEST_CONFIG.DATABASE,
          LOGGING: true,
        },
      };
    default:
      return TEST_CONFIG;
  }
};

/**
 * Test data factories
 */
export const TestDataFactories = {
  /**
   * Create a test user object
   */
  createUser: (overrides: Partial<TestUser> = {}): TestUser => ({
    id: `user-${Date.now()}`,
    email: `test-${Date.now()}@example.com`,
    passwordHash: '$2b$12$test.hashed.password.hash',
    isVerified: false,
    verificationToken: `verification-${Date.now()}`,
    verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    resetPasswordToken: null,
    resetPasswordExpires: null,
    failedLoginAttempts: 0,
    lockedUntil: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),

  /**
   * Create a test refresh token object
   */
  createRefreshToken: (
    userId: string,
    overrides: Partial<TestRefreshToken> = {},
  ): TestRefreshToken => ({
    id: `token-${Date.now()}`,
    token: `refresh-token-${Date.now()}`,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    userId,
    createdAt: new Date(),
    ...overrides,
  }),

  /**
   * Create a JWT payload
   */
  createJwtPayload: (
    userId: string,
    email: string,
    overrides: Partial<TestJwtPayload> = {},
  ): TestJwtPayload => {
    const now = Math.floor(Date.now() / 1000)
    return {
      sub: userId,
      email,
      iat: now,
      exp: now + 1800, // 30 minutes
      ...overrides,
    }
  },

  /**
   * Create login credentials
   */
  createLoginCredentials: (
    overrides: Partial<LoginCredentials> = {},
  ): LoginCredentials => ({
    email: TEST_CONFIG.TEST_USERS.VALID.email,
    password: TEST_CONFIG.TEST_USERS.VALID.password,
    ...overrides,
  }),

  /**
   * Create registration data
   */
  createRegistrationData: (
    overrides: Partial<RegistrationData> = {},
  ): RegistrationData => ({
    email: `new-user-${Date.now()}@example.com`,
    password: 'NewUserPass123!',
    confirmPassword: 'NewUserPass123!',
    ...overrides,
  }),
}

/**
 * Test assertions helpers
 */
export const TestAssertions = {
  /**
   * Assert API response structure
   */
  assertApiResponse: (
    response: Record<string, unknown>,
    expectedKeys: string[],
  ): void => {
    expect(response).toBeDefined()
    expectedKeys.forEach(key => {
      expect(response).toHaveProperty(key)
    })
  },

  /**
   * Assert error response structure
   */
  assertErrorResponse: (
    error: {
      status?: number;
      response?: { status?: number; data?: { message?: string } };
      message?: string;
    },
    expectedStatus?: number,
    expectedMessage?: string,
  ): void => {
    expect(error).toBeDefined()
    if (expectedStatus) {
      expect(error.status || error.response?.status).toBe(expectedStatus)
    }
    if (expectedMessage) {
      expect(error.message || error.response?.data?.message).toMatch(
        expectedMessage
      )
    }
  },

  /**
   * Assert user object structure
   */
  assertUserObject: (user: Partial<TestUser>): void => {
    expect(user).toHaveProperty('id')
    expect(user).toHaveProperty('email')
    expect(user).toHaveProperty('isVerified')
    expect(user).toHaveProperty('createdAt')
    expect(user).not.toHaveProperty('passwordHash') // Should not expose password
  },

  /**
   * Assert JWT token structure
   */
  assertJwtToken: (token: string) => {
    expect(token).toBeDefined()
    expect(typeof token).toBe('string')
    expect(token.split('.')).toHaveLength(3) // JWT has 3 parts
  },
}

export default TEST_CONFIG
