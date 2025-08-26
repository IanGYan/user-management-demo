import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from '../services/crypto.service';

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoService],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hashPassword', () => {
    it('should hash a password successfully', async () => {
      const password = 'testPassword123!';
      const hashedPassword = await service.hashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(typeof hashedPassword).toBe('string');
      expect(hashedPassword.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'testPassword123!';
      const hash1 = await service.hashPassword(password);
      const hash2 = await service.hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const password = 'testPassword123!';
      const hashedPassword = await service.hashPassword(password);
      const isValid = await service.verifyPassword(password, hashedPassword);

      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'testPassword123!';
      const wrongPassword = 'wrongPassword123!';
      const hashedPassword = await service.hashPassword(password);
      const isValid = await service.verifyPassword(
        wrongPassword,
        hashedPassword,
      );

      expect(isValid).toBe(false);
    });
  });

  describe('generateSalt', () => {
    it('should generate a salt', async () => {
      const salt = await service.generateSalt();

      expect(salt).toBeDefined();
      expect(typeof salt).toBe('string');
      expect(salt.length).toBeGreaterThan(0);
    });

    it('should generate different salts', async () => {
      const salt1 = await service.generateSalt();
      const salt2 = await service.generateSalt();

      expect(salt1).not.toBe(salt2);
    });
  });

  describe('hashPasswordWithSalt', () => {
    it('should hash password with custom salt', async () => {
      const password = 'testPassword123!';
      const salt = await service.generateSalt();
      const hashedPassword = await service.hashPasswordWithSalt(password, salt);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(typeof hashedPassword).toBe('string');
    });
  });
});
