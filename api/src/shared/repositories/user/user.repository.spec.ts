import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Roles } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { PrismaService } from '@services/prisma.service';
import {
  regularUserMock,
  usersMock,
} from '@mocks/user.mock';
import { UserRepository } from './user.repository';
import { FindUsersDTO } from '../../../user/dto/find-users.dto';
import { CreateUserDTO } from '../../../user/dto/create-user.dto';
import { UpdateUserDTO } from '../../../user/dto/update-user.dto';

describe('UserRepository', () => {
  let repository: UserRepository;
  let prismaService: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const prismaServiceMock = mockDeep<PrismaService>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    prismaService = module.get<DeepMockProxy<PrismaService>>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create()', () => {
    const createUserPayload: CreateUserDTO = {
      name: regularUserMock.name,
      email: regularUserMock.email,
      password: regularUserMock.password,
      caloriesPerDay: regularUserMock.config.caloriesPerDay,
    };

    it('should create a user', async () => {
      prismaService.user.create.mockResolvedValue(regularUserMock);

      const user = await repository.create(createUserPayload);

      expect(user).toBeDefined();
      expect(prismaService.user.create).toHaveBeenCalled();
      expect(prismaService.user.create).toHaveBeenCalledTimes(1);
      expect(user).toEqual(regularUserMock);
    });

    it('should throw a conflict error if email already exists', async () => {
      prismaService.user.findUnique.mockResolvedValue(regularUserMock);

      try {
        await repository.create(createUserPayload);
      } catch (e) {
        expect(e).toBeDefined();
        expect(e).toBeInstanceOf(ConflictException);
        expect(prismaService.user.create).toHaveBeenCalledTimes(0);
        expect(prismaService.user.findUnique).toHaveBeenCalled();
        expect(prismaService.user.findUnique).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('findAll()', () => {
    const searchUsersPayload: FindUsersDTO = {
      page: 0,
      count: 10,
      order: 'asc',
      orderBy: 'createdAt',
      role: Roles.ADMIN,
    };

    it('should return users', async () => {
      prismaService.user.findMany.mockResolvedValue(usersMock);

      const users = await repository.findAll(searchUsersPayload);

      expect(users).toBeDefined();
      expect(prismaService.user.findMany).toHaveBeenCalled();
      expect(prismaService.user.findMany).toHaveBeenCalledTimes(1);
      expect(prismaService.user.findMany).toHaveBeenCalledWith({
        where: { role: searchUsersPayload.role },
        take: searchUsersPayload.count,
        skip: searchUsersPayload.page * searchUsersPayload.count,
        orderBy: { [searchUsersPayload.orderBy]: searchUsersPayload.order },
      });
      expect(users).toHaveLength(3);
      expect(users).toEqual(usersMock);
    });
  });

  describe('findOne()', () => {
    it('should return a user', async () => {
      prismaService.user.findUniqueOrThrow.mockResolvedValue(regularUserMock);

      const user = await repository.findOne(regularUserMock.id);

      expect(user).toBeDefined();
      expect(prismaService.user.findUniqueOrThrow).toHaveBeenCalled();
      expect(prismaService.user.findUniqueOrThrow).toHaveBeenCalledTimes(1);
      expect(user).toEqual(regularUserMock);
    });
  });

  describe('findByEmail()', () => {
    it('should return a user', async () => {
      prismaService.user.findUniqueOrThrow.mockResolvedValue(regularUserMock);

      const user = await repository.findByEmail(regularUserMock.email);

      expect(user).toBeDefined();
      expect(prismaService.user.findUniqueOrThrow).toHaveBeenCalled();
      expect(prismaService.user.findUniqueOrThrow).toHaveBeenCalledTimes(1);
      expect(user).toEqual(regularUserMock);
    });
  });

  describe('update()', () => {
    const updateUserPayload: UpdateUserDTO = {
      name: regularUserMock.name,
      email: regularUserMock.email,
      password: regularUserMock.password,
      role: regularUserMock.role,
      caloriesPerDay: regularUserMock.config.caloriesPerDay,
    };

    it('should update a user', async () => {
      prismaService.user.update.mockResolvedValue(regularUserMock);

      const user = await repository.update(
        regularUserMock.id,
        updateUserPayload,
      );

      expect(user).toBeDefined();
      expect(prismaService.user.update).toHaveBeenCalled();
      expect(prismaService.user.update).toHaveBeenCalledTimes(1);
      expect(user).toEqual(regularUserMock);
    });

    it('should throw a conflict error if email already exists', async () => {
      prismaService.user.findUnique.mockResolvedValueOnce(regularUserMock);

      try {
        await repository.update(regularUserMock.id, updateUserPayload);
      } catch (e) {
        expect(e).toBeDefined();
        expect(e).toBeInstanceOf(ConflictException);
        expect(prismaService.user.update).toHaveBeenCalledTimes(0);
        expect(prismaService.user.findUnique).toHaveBeenCalled();
        expect(prismaService.user.findUnique).toHaveBeenCalledTimes(1);
      }
    });

    it('should throw a forbidden exception if is another regular user', async () => {
      try {
        await repository.update(regularUserMock.id, updateUserPayload);
      } catch (e) {
        expect(e).toBeDefined();
        expect(e).toBeInstanceOf(ConflictException);
        expect(prismaService.user.update).toHaveBeenCalledTimes(0);
        expect(prismaService.user.findUnique).toHaveBeenCalledTimes(0);
      }
    });
  });

  describe('delete()', () => {
    it('should delete a user', async () => {
      prismaService.user.delete.mockResolvedValue(regularUserMock);

      const user = await repository.delete(regularUserMock.id);

      expect(user).toBeDefined();
      expect(prismaService.user.delete).toHaveBeenCalled();
      expect(prismaService.user.delete).toHaveBeenCalledTimes(1);
      expect(prismaService.user.findUniqueOrThrow).toHaveBeenCalled();
      expect(prismaService.user.findUniqueOrThrow).toHaveBeenCalledTimes(1);
      expect(user).toEqual(regularUserMock);
    });
  });
});