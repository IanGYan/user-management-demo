import { DataSource } from 'typeorm';
import { User } from '../src/user/entities/user.entity';
import { RefreshToken } from '../src/auth/entities/refresh-token.entity';

/**
 * Test database configuration
 * Uses in-memory SQLite for fast, isolated testing
 */
export const testDataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  dropSchema: true,
  entities: [User, RefreshToken],
  synchronize: true,
  logging: false,
  migrations: [],
});

/**
 * Initialize test database
 * Creates tables and sets up the test environment
 */
export async function initTestDatabase(): Promise<DataSource> {
  if (!testDataSource.isInitialized) {
    await testDataSource.initialize();
  }
  return testDataSource;
}

/**
 * Clean up test database
 * Removes all data and closes connection
 */
export async function cleanupTestDatabase(): Promise<void> {
  if (testDataSource.isInitialized) {
    // Clear all tables
    const entities = testDataSource.entityMetadatas;

    for (const entity of entities) {
      const repository = testDataSource.getRepository(entity.name);
      await repository.query(`DELETE FROM ${entity.tableName}`);
    }
  }
}

/**
 * Destroy test database
 * Completely closes the database connection
 */
export async function destroyTestDatabase(): Promise<void> {
  if (testDataSource.isInitialized) {
    await testDataSource.destroy();
  }
}

/**
 * Create test user in database
 * @param userData Partial user data
 * @returns Created user entity
 */
export async function createTestUser(
  userData: Partial<User> = {},
): Promise<User> {
  const userRepository = testDataSource.getRepository(User);

  const defaultUser = {
    email: `test-${Date.now()}@example.com`,
    passwordHash: '$2b$12$test.hashed.password',
    isVerified: false,
    verificationToken: 'test-verification-token',
    verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    resetPasswordToken: null,
    resetPasswordExpires: null,
    failedLoginAttempts: 0,
    lockedUntil: null,
  };

  const user = userRepository.create({
    ...defaultUser,
    ...userData,
  });

  return await userRepository.save(user);
}

/**
 * Create test refresh token in database
 * @param user User entity to associate with token
 * @param tokenData Partial token data
 * @returns Created refresh token entity
 */
export async function createTestRefreshToken(
  user: User,
  tokenData: Partial<RefreshToken> = {},
): Promise<RefreshToken> {
  const tokenRepository = testDataSource.getRepository(RefreshToken);

  const defaultToken = {
    token: `test-refresh-token-${Date.now()}`,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    user,
  };

  const refreshToken = tokenRepository.create({
    ...defaultToken,
    ...tokenData,
  });

  return await tokenRepository.save(refreshToken);
}

/**
 * Seed test database with initial data
 * Creates common test data for use across tests
 */
export async function seedTestDatabase(): Promise<{
  verifiedUser: User;
  unverifiedUser: User;
  lockedUser: User;
}> {
  // Create a verified test user
  const verifiedUser = await createTestUser({
    email: 'verified@example.com',
    isVerified: true,
    verificationToken: null,
    verificationTokenExpires: null,
  });

  // Create an unverified test user
  const unverifiedUser = await createTestUser({
    email: 'unverified@example.com',
    isVerified: false,
  });

  // Create a locked test user
  const lockedUser = await createTestUser({
    email: 'locked@example.com',
    isVerified: true,
    failedLoginAttempts: 5,
    lockedUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
  });

  // Create refresh tokens for verified user
  await createTestRefreshToken(verifiedUser);

  return {
    verifiedUser,
    unverifiedUser,
    lockedUser,
  };
}

/**
 * Get test database statistics
 * Returns count of records in each table
 */
export async function getTestDatabaseStats(): Promise<{
  users: number;
  refreshTokens: number;
}> {
  const userRepository = testDataSource.getRepository(User);
  const tokenRepository = testDataSource.getRepository(RefreshToken);

  const userCount = await userRepository.count();
  const tokenCount = await tokenRepository.count();

  return {
    users: userCount,
    refreshTokens: tokenCount,
  };
}
