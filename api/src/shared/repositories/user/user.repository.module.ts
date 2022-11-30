import { Module } from '@nestjs/common';
import { PrismaService } from '@services/prisma.service';
import { UserRepository } from './user.repository';

@Module({
  providers: [UserRepository, PrismaService],
  exports: [UserRepository],
})
export class UserRepositoryModule {}
