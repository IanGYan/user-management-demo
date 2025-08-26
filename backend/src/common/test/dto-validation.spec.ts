import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { RegisterDto, LoginDto } from '../../auth/dto';
import { UpdateUserDto, ForgotPasswordDto } from '../../user/dto';

describe('DTO Validation', () => {
  describe('RegisterDto', () => {
    it('should pass validation with valid data', async () => {
      const validData = {
        email: 'test@example.com',
        password: 'SecurePass123!',
      };

      const dto = plainToClass(RegisterDto, validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid email', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'SecurePass123!',
      };

      const dto = plainToClass(RegisterDto, invalidData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('email');
    });

    it('should fail validation with weak password', async () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'weak',
      };

      const dto = plainToClass(RegisterDto, invalidData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('password');
    });
  });

  describe('LoginDto', () => {
    it('should pass validation with valid data', async () => {
      const validData = {
        email: 'test@example.com',
        password: 'anypassword',
      };

      const dto = plainToClass(LoginDto, validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid email', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'anypassword',
      };

      const dto = plainToClass(LoginDto, invalidData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('email');
    });
  });

  describe('ForgotPasswordDto', () => {
    it('should pass validation with valid email', async () => {
      const validData = {
        email: 'test@example.com',
      };

      const dto = plainToClass(ForgotPasswordDto, validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid email', async () => {
      const invalidData = {
        email: 'invalid-email',
      };

      const dto = plainToClass(ForgotPasswordDto, invalidData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('email');
    });
  });

  describe('UpdateUserDto', () => {
    it('should pass validation when all fields are optional and valid', async () => {
      const validData = {
        email: 'newemail@example.com',
        currentPassword: 'currentpass',
        newPassword: 'NewSecurePass123!',
      };

      const dto = plainToClass(UpdateUserDto, validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should pass validation when no fields are provided', async () => {
      const emptyData = {};

      const dto = plainToClass(UpdateUserDto, emptyData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid new password', async () => {
      const invalidData = {
        newPassword: 'weak',
      };

      const dto = plainToClass(UpdateUserDto, invalidData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('newPassword');
    });
  });
});
