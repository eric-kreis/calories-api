import { UserEntity } from '@user/entities/user.entity';
import { adminUserMock, managerUserMock, regularUserMock } from './user.mock';

const getRequestUserMockFromUser = (user: UserEntity) => ({
  id: user.id,
  email: user.email,
  role: user.role,
  caloriesPerDay: user.config.caloriesPerDay,
});

export const regularRequestUserMock = getRequestUserMockFromUser(regularUserMock);
export const managerRequestUserMock = getRequestUserMockFromUser(managerUserMock);
export const adminRequestUserMock = getRequestUserMockFromUser(adminUserMock);
