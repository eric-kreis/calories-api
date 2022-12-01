import { UserEntity } from '@user/entities/user.entity';
import { AuthUserEntity } from 'src/auth/entities/auth-user.entity';
import { adminUserMock, managerUserMock, regularUserMock } from './user.mock';

const getAuthUserFromUser = (user: UserEntity): AuthUserEntity => ({
  id: user.id,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  password: user.password,
  name: user.name,
  email: user.email,
  role: user.role,
  config: user.config,
  accessToken: '',
});

export const regularAuthUserMock = getAuthUserFromUser(regularUserMock);
export const managerAuthUserMock = getAuthUserFromUser(managerUserMock);
export const adminAuthUserMock = getAuthUserFromUser(adminUserMock);
