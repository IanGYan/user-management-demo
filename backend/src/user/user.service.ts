import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

/**
 * Service responsible for user management business logic
 */
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Returns test message for health check
   */
  getTestMessage(): string {
    return 'User module is working!';
  }

  /**
   * Finds a user by their ID
   * @param id - User ID to search for
   * @returns User entity or null if not found
   */
  async findById(id: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      return user;
    } catch (error) {
      this.logger.error(`查找用户失败 [ID: ${id}]`, error);
      return null;
    }
  }
}
