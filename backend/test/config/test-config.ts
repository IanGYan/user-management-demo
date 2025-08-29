/**
 * Backend test configuration and constants
 * Centralized configuration for all backend tests
 */

// Type definitions for test data
interface TestUser {
  id: string;
  email: string;
  passwordHash: string;
  isVerified: boolean;
  verificationToken?: string | null;
  verificationTokenExpires?: Date | null;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  failedLoginAttempts: number;
  lockedUntil?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  firstName?: string;
  lastName?: string;
}

interface TestRefreshToken {
  id: string;
  token: string;
  expiresAt: Date;
  user: TestUser;
  createdAt: Date;
}

interface TestJwtPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

interface LoginDto {
  email: string;
  password: string;
}

interface RegisterDto {
  email: string;
  password: string;
}

interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
}

interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: TestUser;
}

export const TEST_CONFIG = {
  // Timeouts
  DEFAULT_TIMEOUT: 30000,
  API_TIMEOUT: 15000,
  DATABASE_TIMEOUT: 10000,

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

  // Bcrypt settings
  BCRYPT: {
    ROUNDS: 10, // Lower rounds for faster testing
  },

  // API endpoints
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

  // Test users
  TEST_USERS: {
    VALID: {
      email: 'test@example.com',
      password: 'ValidPassword123!',
      passwordHash: '$2b$10$test.hashed.password',
      id: 'test-user-id-1',
    },
    VERIFIED: {
      email: 'verified@example.com',
      password: 'VerifiedPass123!',
      passwordHash: '$2b$10$verified.hashed.password',
      id: 'verified-user-id',
      isVerified: true,
    },
    UNVERIFIED: {
      email: 'unverified@example.com',
      password: 'UnverifiedPass123!',
      passwordHash: '$2b$10$unverified.hashed.password',
      id: 'unverified-user-id',
      isVerified: false,
    },
    LOCKED: {
      email: 'locked@example.com',
      password: 'LockedPass123!',
      passwordHash: '$2b$10$locked.hashed.password',
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

  // HTTP status codes
  STATUS_CODES: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
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
    DATABASE: {
      CONNECTION_ERROR: 'Database connection error',
      QUERY_ERROR: 'Database query error',
      CONSTRAINT_ERROR: 'Database constraint error',
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
};

/**
 * Environment-specific test configuration
 */
export const getTestEnvironment = (): typeof TEST_CONFIG => {
  const env = process.env.NODE_ENV || 'test';

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
 * Test data factories for backend
 */
export const TestDataFactories = {
  /**
   * Create a test user object
   */
  createUser: (overrides: Partial<TestUser> = {}): TestUser => ({
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    email: `test-${Date.now()}@example.com`,
    passwordHash: '$2b$10$test.hashed.password.hash.example',
    isVerified: false,
    verificationToken: `verification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
    user: TestUser,
    overrides: Partial<TestRefreshToken> = {},
  ): TestRefreshToken => ({
    id: `token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    token: `refresh-token-${Date.now()}-${Math.random().toString(36).substr(2, 16)}`,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    user,
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
    const now = Math.floor(Date.now() / 1000);
    return {
      sub: userId,
      email,
      iat: now,
      exp: now + 1800, // 30 minutes
      ...overrides,
    };
  },

  /**
   * Create login DTO
   */
  createLoginDto: (overrides: Partial<LoginDto> = {}): LoginDto => ({
    email: TEST_CONFIG.TEST_USERS.VALID.email,
    password: TEST_CONFIG.TEST_USERS.VALID.password,
    ...overrides,
  }),

  /**
   * Create register DTO
   */
  createRegisterDto: (overrides: Partial<RegisterDto> = {}): RegisterDto => ({
    email: `new-user-${Date.now()}@example.com`,
    password: 'NewUserPass123!',
    ...overrides,
  }),

  /**
   * Create update profile DTO
   */
  createUpdateProfileDto: (
    overrides: Partial<UpdateProfileDto> = {},
  ): UpdateProfileDto => ({
    firstName: 'Test',
    lastName: 'User',
    ...overrides,
  }),

  /**
   * Create change password DTO
   */
  createChangePasswordDto: (
    overrides: Partial<ChangePasswordDto> = {},
  ): ChangePasswordDto => ({
    currentPassword: 'CurrentPass123!',
    newPassword: 'NewPass123!',
    ...overrides,
  }),
};

/**
 * Test assertions helpers for backend
 */
export const TestAssertions = {
  /**
   * Assert response structure
   */
  assertResponse: (
    response: Record<string, unknown>,
    expectedKeys: string[],
  ): void => {
    expect(response).toBeDefined();
    expectedKeys.forEach((key) => {
      expect(response).toHaveProperty(key);
    });
  },

  /**
   * Assert error response structure
   */
  assertErrorResponse: (
    error: { status?: number; message?: string | RegExp },
    expectedStatus?: number,
    expectedMessage?: string,
  ): void => {
    expect(error).toBeDefined();
    if (expectedStatus) {
      expect(error.status).toBe(expectedStatus);
    }
    if (expectedMessage) {
      expect(error.message).toMatch(expectedMessage);
    }
  },

  /**
   * Assert user entity structure
   */
  assertUserEntity: (user: TestUser): void => {
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('passwordHash');
    expect(user).toHaveProperty('isVerified');
    expect(user).toHaveProperty('createdAt');
    expect(user).toHaveProperty('updatedAt');
  },

  /**
   * Assert user response structure (without sensitive data)
   */
  assertUserResponse: (user: Partial<TestUser>): void => {
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('isVerified');
    expect(user).toHaveProperty('createdAt');
    expect(user).not.toHaveProperty('passwordHash'); // Should not expose password
    expect(user).not.toHaveProperty('verificationToken'); // Should not expose tokens
  },

  /**
   * Assert refresh token entity structure
   */
  assertRefreshTokenEntity: (token: TestRefreshToken): void => {
    expect(token).toHaveProperty('id');
    expect(token).toHaveProperty('token');
    expect(token).toHaveProperty('expiresAt');
    expect(token).toHaveProperty('user');
    expect(token).toHaveProperty('createdAt');
  },

  /**
   * Assert JWT token structure
   */
  assertJwtToken: (token: string): void => {
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
  },

  /**
   * Assert authentication response structure
   */
  assertAuthResponse: (authResponse: AuthResponse): void => {
    expect(authResponse).toHaveProperty('accessToken');
    expect(authResponse).toHaveProperty('refreshToken');
    expect(authResponse).toHaveProperty('user');

    TestAssertions.assertJwtToken(authResponse.accessToken);
    TestAssertions.assertJwtToken(authResponse.refreshToken);
    TestAssertions.assertUserResponse(authResponse.user);
  },
};

/**
 * Mock data generators
 */
export const MockDataGenerators = {
  /**
   * Generate random email
   */
  generateEmail: (): string =>
    `test-${Date.now()}-${Math.random().toString(36).substr(2, 5)}@example.com`,

  /**
   * Generate random password
   */
  generatePassword: (): string => `Pass${Date.now()}!`,

  /**
   * Generate random string
   */
  generateString: (length: number = 10): string =>
    Math.random().toString(36).substr(2, length),

  /**
   * Generate UUID-like string
   */
  generateUuid: (): string =>
    `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 9)}`,
};

export default TEST_CONFIG;
