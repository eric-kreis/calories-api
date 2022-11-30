import { usersMock, regularUserMock } from '@mocks/user.mock';
import { regularRequestUserMock } from '@mocks/request-user.mock';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { FindUsersDTO } from './dto/find-users.dto';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: DeepMockProxy<UserService>;

  beforeEach(async () => {
    const userServiceMock = mockDeep<UserService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: userServiceMock,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<DeepMockProxy<UserService>>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll()', () => {
    const searchUsersPayload: FindUsersDTO = {
      page: 0,
      count: 10,
      order: 'asc',
      orderBy: 'createdAt',
    };

    it('should return users', async () => {
      service.findAll.mockResolvedValue(usersMock);

      const users = await controller.findAll(searchUsersPayload);

      expect(users).toBeDefined();
      expect(users).toEqual(usersMock);
      expect(service.findAll).toHaveBeenCalled();
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne()', () => {
    it('should return user', async () => {
      service.findOne.mockResolvedValue(regularUserMock);

      const user = await controller.findOne(
        regularUserMock.id,
        { user: regularRequestUserMock } as any,
      );

      expect(user).toBeDefined();
      expect(user).toEqual(regularUserMock);
      expect(service.findOne).toHaveBeenCalled();
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('update()', () => {
    it('hould update a user', async () => {
      service.update.mockResolvedValue(regularUserMock);

      const user = await controller.update(
        regularUserMock.id,
        {},
        { user: regularUserMock } as any,
      );

      expect(user).toBeDefined();
      expect(user).toEqual(regularUserMock);
      expect(service.update).toHaveBeenCalled();
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete()', () => {
    it('should return users', async () => {
      service.delete.mockResolvedValue(regularUserMock);

      const user = await controller.delete(regularUserMock.id, { user: regularUserMock } as any);

      expect(user).toBeDefined();
      expect(user).toEqual(regularUserMock);
      expect(service.delete).toHaveBeenCalled();
      expect(service.delete).toHaveBeenCalledTimes(1);
    });
  });
});
