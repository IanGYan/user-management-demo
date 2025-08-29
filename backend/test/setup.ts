// Global test setup file
// This file runs before all tests and sets up the testing environment

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, ObjectLiteral } from 'typeorm';
import {
  Type,
  DynamicModule,
  ForwardReference,
  Provider,
} from '@nestjs/common';

// Global test timeout (30 seconds)
jest.setTimeout(30000);

// Mock console methods in tests to keep output clean
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  // Suppress console.error and console.warn in tests unless explicitly needed
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  // Restore original console methods
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Type definitions for Jest matchers
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeValidDate(): R;
      toBeValidUUID(): R;
    }
  }
}

// Custom Jest matchers
expect.extend({
  toBeValidDate(received: unknown): { message: () => string; pass: boolean } {
    const pass = received instanceof Date && !isNaN(received.getTime());
    return {
      message: (): string =>
        `expected ${String(received)} to be a valid Date object`,
      pass,
    };
  },

  toBeValidUUID(received: unknown): { message: () => string; pass: boolean } {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const pass = typeof received === 'string' && uuidRegex.test(received);
    return {
      message: (): string => `expected ${String(received)} to be a valid UUID`,
      pass,
    };
  },
});

/**
 * Create a mock repository for testing
 * @param entity Entity class
 * @returns Mock repository with common methods
 */
export function createMockRepository<
  T extends ObjectLiteral = ObjectLiteral,
>(): Partial<Repository<T>> {
  return {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(),
  };
}

/**
 * Create a testing module with common providers
 * @param providers Additional providers to include
 * @param imports Additional modules to import
 * @returns TestingModule
 */
export async function createTestingModule({
  providers = [],
  imports = [],
  controllers = [],
}: {
  providers?: Provider[];
  imports?: (
    | Type
    | DynamicModule
    | Promise<DynamicModule>
    | ForwardReference
  )[];
  controllers?: Type[];
} = {}): Promise<TestingModule> {
  return Test.createTestingModule({
    imports,
    controllers,
    providers,
  }).compile();
}

/**
 * Create mock providers for entities
 * @param entities Array of entity classes
 * @returns Array of mock providers
 */
export function createMockProviders(entities: Type[]): Provider[] {
  return entities.map((entity) => ({
    provide: getRepositoryToken(
      entity as Parameters<typeof getRepositoryToken>[0],
    ),
    useValue: createMockRepository(),
  }));
}

// Type definitions for test data
interface MockUser {
  id: string;
  email: string;
  passwordHash: string;
  isVerified: boolean;
  verificationToken: string | null;
  verificationTokenExpires: Date | null;
  resetPasswordToken: string | null;
  resetPasswordExpires: Date | null;
  failedLoginAttempts: number;
  lockedUntil: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface MockRefreshToken {
  id: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  user: MockUser;
}

interface MockJwtPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

// Common test data factories
export const TestDataFactory = {
  /**
   * Create a mock user object
   */
  createMockUser: (overrides: Partial<MockUser> = {}): MockUser => ({
    id: 'test-user-id',
    email: 'test@example.com',
    passwordHash: '$2b$12$test.hashed.password',
    isVerified: true,
    verificationToken: null,
    verificationTokenExpires: null,
    resetPasswordToken: null,
    resetPasswordExpires: null,
    failedLoginAttempts: 0,
    lockedUntil: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),

  /**
   * Create a mock refresh token object
   */
  createMockRefreshToken: (
    overrides: Partial<MockRefreshToken> = {},
  ): MockRefreshToken => ({
    id: 'test-token-id',
    token: 'test-refresh-token',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    createdAt: new Date(),
    user: TestDataFactory.createMockUser(),
    ...overrides,
  }),

  /**
   * Create mock JWT payload
   */
  createMockJwtPayload: (
    overrides: Partial<MockJwtPayload> = {},
  ): MockJwtPayload => ({
    sub: 'test-user-id',
    email: 'test@example.com',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 1800, // 30 minutes
    ...overrides,
  }),
};

// Environment variables for testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.BCRYPT_ROUNDS = '10';
