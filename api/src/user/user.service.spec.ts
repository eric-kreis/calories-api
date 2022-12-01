import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Roles } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '@repositories/user/user.repository';
import { managerRequestUserMock, regularRequestUserMock } from '@mocks/request-user.mock';
import { RoleService } from '@services/role.service';
import { ForbiddenException } from '@nestjs/common';
import { adminUserMock, regularUserMock, usersMock } from '@mocks/user.mock';
import { FindUsersDTO } from './dto/find-users.dto';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';

describe('UserService', () => {
  let service: UserService;
  let repository: DeepMockProxy<UserRepository>;

  beforeEach(async () => {
    const userRepositoryMock = mockDeep<UserRepository>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        RoleService,
        {
          provide: UserRepository,
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<DeepMockProxy<UserRepository>>(UserRepository);
  });

  describe('findAll()', () => {
    const searchUsersPayload: FindUsersDTO = {
      orderBy: 'name',
      order: 'desc',
      page: 0,
      count: 5,
    };

    it('should return users', async () => {
      repository.findAll.mockResolvedValue(usersMock);

      const users = await service.findAll(searchUsersPayload);

      expect(users).toBeDefined();
      expect(users).toEqual(usersMock);
      users.forEach((user) => expect(user).toBeInstanceOf(UserEntity));
      expect(repository.findAll).toHaveBeenCalled();
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne()', () => {
    it('should return a user', async () => {
      repository.findOne.mockResolvedValue(regularUserMock);

      const user = await service.findOne(regularUserMock.id, regularRequestUserMock);

      expect(user).toBeDefined();
      expect(user).toEqual(regularUserMock);
      expect(user).toBeInstanceOf(UserEntity);
      expect(repository.findOne).toBeCalled();
      expect(repository.findOne).toBeCalledTimes(1);
    });

    it('should throw an forbidden error if user hasn\'t enough permissions', async () => {
      try {
        await service.findOne(adminUserMock.id, regularRequestUserMock);
      } catch (e) {
        expect(e).toBeDefined();
        expect(e).toBeInstanceOf(ForbiddenException);
      }
    });
  });

  describe('update()', () => {
    it('should return the updated user', async () => {
      repository.findOne.mockResolvedValue(regularUserMock);
      repository.update.mockResolvedValue(regularUserMock);

      const updatedUser = await service.update(regularUserMock.id, {}, regularRequestUserMock);

      expect(updatedUser).toBeDefined();
      expect(updatedUser).toEqual(regularUserMock);
      expect(updatedUser).toBeInstanceOf(UserEntity);
      expect(repository.update).toBeCalled();
      expect(repository.update).toBeCalledTimes(1);
    });

    it('should throw an forbidden error if user cannot access the resource', async () => {
      repository.findOne.mockResolvedValue(regularUserMock);

      try {
        await service.update(adminUserMock.id, {}, regularRequestUserMock);
      } catch (e) {
        expect(e).toBeDefined();
        expect(e).toBeInstanceOf(ForbiddenException);
      }
    });

    it('should throw an forbidden error if a non-admin try to update role', async () => {
      repository.findOne.mockResolvedValue(regularUserMock);

      try {
        await service.update(regularUserMock.id, { role: Roles.ADMIN }, managerRequestUserMock);
      } catch (e) {
        expect(e).toBeDefined();
        expect(e).toBeInstanceOf(ForbiddenException);
      }
    });
  });

  describe('delete()', () => {
    it('should return the updated user', async () => {
      repository.findOne.mockResolvedValue(regularUserMock);
      repository.delete.mockResolvedValue(regularUserMock);

      const updatedUser = await service.delete(regularUserMock.id, regularRequestUserMock);

      expect(updatedUser).toBeDefined();
      expect(updatedUser).toEqual(regularUserMock);
      expect(updatedUser).toBeInstanceOf(UserEntity);
      expect(repository.delete).toBeCalled();
      expect(repository.delete).toBeCalledTimes(1);
    });

    it('should throw an forbidden error if user cannot access the resource', async () => {
      try {
        await service.delete(adminUserMock.id, regularRequestUserMock);
      } catch (e) {
        expect(e).toBeDefined();
        expect(e).toBeInstanceOf(ForbiddenException);
      }
    });

    it('should throw an forbidden error if a manager try to delete an non-regular user', async () => {
      repository.findOne.mockResolvedValue(adminUserMock);

      try {
        await service.delete(adminUserMock.id, managerRequestUserMock);
      } catch (e) {
        expect(e).toBeDefined();
        expect(e).toBeInstanceOf(ForbiddenException);
      }
    });
  });
});
