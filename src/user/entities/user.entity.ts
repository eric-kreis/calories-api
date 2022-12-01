import { Roles, User as UserModel, UserConfig } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements UserModel {
  id: string;

  createdAt: Date;

  updatedAt: Date;

  name: string;

  email: string;

  @Exclude()
  password: string;

  role: keyof typeof Roles;

  config: UserConfig;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
