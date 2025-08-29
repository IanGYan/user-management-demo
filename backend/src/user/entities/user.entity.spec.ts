import { User } from './user.entity';

describe('User Entity', () => {
  describe('User Entity Creation', () => {
    it('should create a user instance', () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        passwordHash: '$2b$10$test.hash',
        isVerified: false,
        verificationToken: 'test-token',
        verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        resetPasswordToken: null,
        resetPasswordExpires: null,
        failedLoginAttempts: 0,
        lockedUntil: null,
      };

      // Act
      const user = new User();
      Object.assign(user, userData);

      // Assert
      expect(user).toBeInstanceOf(User);
      expect(user.email).toBe('test@example.com');
      expect(user.passwordHash).toBe('$2b$10$test.hash');
      expect(user.isVerified).toBe(false);
      expect(user.failedLoginAttempts).toBe(0);
    });

    it('should have correct default values', () => {
      // Act
      const user = new User();
      user.email = 'test@example.com';
      user.passwordHash = '$2b$10$test.hash';

      // Assert
      expect(user.email).toBe('test@example.com');
      expect(user.passwordHash).toBe('$2b$10$test.hash');
    });
  });

  describe('User Entity Methods', () => {
    let user: User;

    beforeEach(() => {
      user = new User();
      user.email = 'test@example.com';
      user.passwordHash = '$2b$10$test.hash';
      user.isVerified = false;
      user.failedLoginAttempts = 0;
      user.lockedUntil = null;
      user.verificationToken = 'test-token';
      user.verificationTokenExpires = new Date(
        Date.now() + 24 * 60 * 60 * 1000,
      );
    });

    it('should check if account is locked', () => {
      // Test unlocked account
      expect(user.isLocked).toBe(false);

      // Test locked account
      user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
      expect(user.isLocked).toBe(true);

      // Test expired lock
      user.lockedUntil = new Date(Date.now() - 15 * 60 * 1000); // 15 minutes ago
      expect(user.isLocked).toBe(false);
    });

    it('should check if verification token is expired', () => {
      // Test valid token
      user.verificationTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
      expect(user.isVerificationTokenExpired).toBe(false);

      // Test expired token
      user.verificationTokenExpires = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
      expect(user.isVerificationTokenExpired).toBe(true);

      // Test null expiration
      user.verificationTokenExpires = null;
      expect(user.isVerificationTokenExpired).toBe(true);
    });

    it('should check if reset password token is expired', () => {
      // Test valid token
      user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
      expect(user.isResetPasswordTokenExpired).toBe(false);

      // Test expired token
      user.resetPasswordExpires = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
      expect(user.isResetPasswordTokenExpired).toBe(true);

      // Test null expiration
      user.resetPasswordExpires = null;
      expect(user.isResetPasswordTokenExpired).toBe(true);
    });
  });
});
