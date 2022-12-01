import { Roles } from '@prisma/client';
import { UserEntity } from '@user/entities/user.entity';

export const regularUserMock: UserEntity = {
  id: '6242c4ae032bc76da250b207',
  createdAt: new Date(),
  updatedAt: new Date(),
  email: 'regular@olby.com',
  name: 'Regular User',
  password: 'password',
  role: Roles.REGULAR,
  config: {
    caloriesPerDay: 1000,
  },
};

export const managerUserMock: UserEntity = {
  id: '6242c4ae032bc76da250b208',
  createdAt: new Date(),
  updatedAt: new Date(),
  email: 'manager@olby.com',
  name: 'Manager User',
  password: 'password',
  role: Roles.MANAGER,
  config: {
    caloriesPerDay: 100,
  },
};

export const adminUserMock: UserEntity = {
  id: '6242c4ae032bc76da250b209',
  createdAt: new Date(),
  updatedAt: new Date(),
  email: 'admin@olby.com',
  name: 'Admin User',
  password: 'password',
  role: Roles.ADMIN,
  config: {
    caloriesPerDay: 500,
  },
};

export const usersMock = [regularUserMock, managerUserMock, adminUserMock];
