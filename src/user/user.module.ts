import { Module } from '@nestjs/common';
import { UserRepositoryModule } from '@repositories/user/user.repository.module';
import { RoleService } from '@services/role.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [UserRepositoryModule],
  controllers: [UserController],
  providers: [UserService, RoleService],
  exports: [UserService],
})
export class UserModule {}
