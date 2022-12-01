import { UserEntity } from '@user/entities/user.entity';

export class AuthUserEntity extends UserEntity {
  constructor(public accessToken: string, partial: Partial<UserEntity>) {
    super(partial);
  }
}
