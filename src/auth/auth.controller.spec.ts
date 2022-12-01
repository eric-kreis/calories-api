import { regularAuthUserMock } from '@mocks/auth-user.mock';
import { regularRequestUserMock } from '@mocks/request-user.mock';
import { regularUserMock } from '@mocks/user.mock';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '@user/user.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: DeepMockProxy<AuthService>;
  let userService: DeepMockProxy<UserService>;

  beforeEach(async () => {
    const authServiceMock = mockDeep<AuthService>();
    const userServiceMock = mockDeep<UserService>();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
        {
          provide: UserService,
          useValue: userServiceMock,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<DeepMockProxy<AuthService>>(AuthService);
    userService = module.get<DeepMockProxy<UserService>>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp()', () => {
    it('should create a user', async () => {
      service.signUp.mockResolvedValue(regularAuthUserMock);

      const user = await controller.signUp({
        name: regularAuthUserMock.name,
        email: regularAuthUserMock.email,
        password: regularAuthUserMock.password,
        caloriesPerDay: regularAuthUserMock.config.caloriesPerDay,
      });

      expect(user).toBeDefined();
      expect(user).toEqual(regularAuthUserMock);
      expect(service.signUp).toHaveBeenCalled();
      expect(service.signUp).toHaveBeenCalledTimes(1);
    });
  });

  describe('signIn()', () => {
    it('should authenticate a user', async () => {
      service.signIn.mockResolvedValue(regularAuthUserMock);

      const user = await controller.signIn({
        email: regularAuthUserMock.email,
        password: regularAuthUserMock.password,
      });

      expect(user).toBeDefined();
      expect(user).toEqual(regularAuthUserMock);
      expect(service.signIn).toHaveBeenCalled();
      expect(service.signIn).toHaveBeenCalledTimes(1);
    });
  });

  describe('profile()', () => {
    it('should return the token\'s profile', async () => {
      userService.findOne.mockResolvedValue(regularUserMock);

      const user = await controller.profile({ user: regularRequestUserMock } as any);

      expect(user).toBeDefined();
      expect(user).toEqual(regularUserMock);
      expect(userService.findOne).toHaveBeenCalled();
      expect(userService.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
