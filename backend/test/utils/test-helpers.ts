import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  Type,
  DynamicModule,
  ForwardReference,
  Provider,
} from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository, ObjectLiteral } from 'typeorm';
import { User } from '../../src/user/entities/user.entity';
import { RefreshToken } from '../../src/auth/entities/refresh-token.entity';
import {
  initTestDatabase,
  cleanupTestDatabase,
  testDataSource,
} from '../database';

/**
 * Test application builder
 * Provides utilities for creating and managing test applications
 */
export class TestAppBuilder {
  private module!: TestingModule;
  private app!: INestApplication;

  /**
   * Create test application with given modules and providers
   * @param modules Modules to import
   * @param providers Additional providers
   * @returns TestAppBuilder instance
   */
  static async create(
    modules: Array<
      Type<unknown> | DynamicModule | Promise<DynamicModule> | ForwardReference
    > = [],
    providers: Provider[] = [],
  ): Promise<TestAppBuilder> {
    const builder = new TestAppBuilder();

    // Initialize test database
    await initTestDatabase();

    builder.module = await Test.createTestingModule({
      imports: modules,
      providers: [
        ...providers,
        {
          provide: getRepositoryToken(User),
          useValue: testDataSource.getRepository(User),
        },
        {
          provide: getRepositoryToken(RefreshToken),
          useValue: testDataSource.getRepository(RefreshToken),
        },
      ],
    }).compile();

    builder.app = builder.module.createNestApplication();
    await builder.app.init();

    return builder;
  }

  /**
   * Get the application instance
   */
  getApp(): INestApplication {
    return this.app;
  }

  /**
   * Get service from the application
   * @param service Service class
   */
  getService<T>(service: new (...args: unknown[]) => T): T {
    return this.app.get<T>(service);
  }

  /**
   * Get repository from the application
   * @param entity Entity class
   */
  getRepository<T extends ObjectLiteral>(
    entity: new (...args: unknown[]) => T,
  ): Repository<T> {
    return this.app.get<Repository<T>>(getRepositoryToken(entity));
  }

  /**
   * Clean up and close the application
   */
  async cleanup(): Promise<void> {
    await cleanupTestDatabase();
    await this.app.close();
  }
}

/**
 * API test helpers
 * Provides utilities for testing REST APIs
 */
export class ApiTestHelpers {
  private readonly app: INestApplication;

  constructor(app: INestApplication) {
    this.app = app;
  }

  /**
   * Make authenticated request
   * @param method HTTP method
   * @param path API path
   * @param token JWT token
   * @param data Request data
   */
  async authenticatedRequest(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    path: string,
    token: string,
    data?: Record<string, unknown>,
  ): Promise<request.Test> {
    let req = request(this.app.getHttpServer() as Parameters<typeof request>[0])
      [method](path)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    if (data && (method === 'post' || method === 'put' || method === 'patch')) {
      req = req.send(data);
    }

    return req;
  }

  /**
   * Make unauthenticated request
   * @param method HTTP method
   * @param path API path
   * @param data Request data
   */
  async request(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    path: string,
    data?: Record<string, unknown>,
  ): Promise<request.Test> {
    let req = request(this.app.getHttpServer() as Parameters<typeof request>[0])
      [method](path)
      .set('Accept', 'application/json');

    if (data && (method === 'post' || method === 'put' || method === 'patch')) {
      req = req.send(data);
    }

    return req;
  }

  /**
   * POST request helper
   */
  post(path: string, data?: Record<string, unknown>): Promise<request.Test> {
    return this.request('post', path, data);
  }

  /**
   * GET request helper
   */
  get(path: string): Promise<request.Test> {
    return this.request('get', path);
  }

  /**
   * PUT request helper
   */
  put(path: string, data?: Record<string, unknown>): Promise<request.Test> {
    return this.request('put', path, data);
  }

  /**
   * PATCH request helper
   */
  patch(path: string, data?: Record<string, unknown>): Promise<request.Test> {
    return this.request('patch', path, data);
  }

  /**
   * DELETE request helper
   */
  delete(path: string): Promise<request.Test> {
    return this.request('delete', path);
  }

  /**
   * Authenticated POST request helper
   */
  authPost(
    path: string,
    token: string,
    data?: Record<string, unknown>,
  ): Promise<request.Test> {
    return this.authenticatedRequest('post', path, token, data);
  }

  /**
   * Authenticated GET request helper
   */
  authGet(path: string, token: string): Promise<request.Test> {
    return this.authenticatedRequest('get', path, token);
  }

  /**
   * Authenticated PUT request helper
   */
  authPut(
    path: string,
    token: string,
    data?: Record<string, unknown>,
  ): Promise<request.Test> {
    return this.authenticatedRequest('put', path, token, data);
  }

  /**
   * Authenticated PATCH request helper
   */
  authPatch(
    path: string,
    token: string,
    data?: Record<string, unknown>,
  ): Promise<request.Test> {
    return this.authenticatedRequest('patch', path, token, data);
  }

  /**
   * Authenticated DELETE request helper
   */
  authDelete(path: string, token: string): Promise<request.Test> {
    return this.authenticatedRequest('delete', path, token);
  }
}

/**
 * Database test helpers
 * Provides utilities for database testing
 */
export class DatabaseTestHelpers {
  /**
   * Get user repository
   */
  static getUserRepository(): Repository<User> {
    return testDataSource.getRepository(User);
  }

  /**
   * Get refresh token repository
   */
  static getRefreshTokenRepository(): Repository<RefreshToken> {
    return testDataSource.getRepository(RefreshToken);
  }

  /**
   * Find user by email
   * @param email User email
   */
  static async findUserByEmail(email: string): Promise<User | null> {
    const userRepository = this.getUserRepository();
    return userRepository.findOne({ where: { email } });
  }

  /**
   * Count users in database
   */
  static async countUsers(): Promise<number> {
    const userRepository = this.getUserRepository();
    return userRepository.count();
  }

  /**
   * Count refresh tokens in database
   */
  static async countRefreshTokens(): Promise<number> {
    const tokenRepository = this.getRefreshTokenRepository();
    return tokenRepository.count();
  }

  /**
   * Clear all data from database
   */
  static async clearDatabase(): Promise<void> {
    const tokenRepository = this.getRefreshTokenRepository();
    const userRepository = this.getUserRepository();

    await tokenRepository.delete({});
    await userRepository.delete({});
  }
}

/**
 * JWT test helpers
 * Provides utilities for JWT token testing
 */
export class JwtTestHelpers {
  /**
   * Create a mock JWT payload
   * @param userId User ID
   * @param email User email
   * @param expiresIn Expiration time
   */
  static createMockPayload(
    userId: string = 'test-user-id',
    email: string = 'test@example.com',
    expiresIn: number = 1800, // 30 minutes
  ): { sub: string; email: string; iat: number; exp: number } {
    const now = Math.floor(Date.now() / 1000);
    return {
      sub: userId,
      email,
      iat: now,
      exp: now + expiresIn,
    };
  }

  /**
   * Create an expired JWT payload
   * @param userId User ID
   * @param email User email
   */
  static createExpiredPayload(
    userId: string = 'test-user-id',
    email: string = 'test@example.com',
  ): { sub: string; email: string; iat: number; exp: number } {
    const now = Math.floor(Date.now() / 1000);
    return {
      sub: userId,
      email,
      iat: now - 3600, // 1 hour ago
      exp: now - 1800, // 30 minutes ago (expired)
    };
  }
}

/**
 * Validation test helpers
 * Provides utilities for testing validation logic
 */
export class ValidationTestHelpers {
  /**
   * Generate invalid email addresses for testing
   */
  static getInvalidEmails(): string[] {
    return [
      'invalid-email',
      '@domain.com',
      'user@',
      'user..name@domain.com',
      'user name@domain.com',
      'user@domain',
      '',
      'a'.repeat(255) + '@domain.com', // Too long
    ];
  }

  /**
   * Generate invalid passwords for testing
   */
  static getInvalidPasswords(): string[] {
    return [
      'short', // Too short
      'nouppercase123!', // No uppercase
      'NOLOWERCASE123!', // No lowercase
      'NoNumbers!', // No numbers
      'NoSpecialChar123', // No special characters
      '', // Empty
      'a'.repeat(129), // Too long
    ];
  }

  /**
   * Generate valid passwords for testing
   */
  static getValidPasswords(): string[] {
    return ['ValidPass123!', 'AnotherGood1@', 'Complex#Pass99', 'Secure$2024'];
  }

  /**
   * Generate valid email addresses for testing
   */
  static getValidEmails(): string[] {
    return [
      'user@example.com',
      'test.email@domain.co.uk',
      'user+tag@example.org',
      'firstname.lastname@company.com',
    ];
  }
}
