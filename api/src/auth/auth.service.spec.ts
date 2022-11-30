import { regularAuthUserMock } from '@mocks/auth-user.mock';
import { regularUserMock } from '@mocks/user.mock';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '@repositories/user/user.repository';
import { EncryptService } from '@services/encrypt/encrypt.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { AuthService } from './auth.service';
import { AuthUserEntity } from './entities/auth-user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let repository: DeepMockProxy<UserRepository>;
  let encryptService: DeepMockProxy<EncryptService>;
  let jwtService: DeepMockProxy<JwtService>;

  beforeEach(async () => {
    const userRepositoryMock = mockDeep<UserRepository>();
    const encryptServiceMock = mockDeep<EncryptService>();
    const jwtServiceMock = mockDeep<JwtService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: userRepositoryMock,
        },
        {
          provide: EncryptService,
          useValue: encryptServiceMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get<DeepMockProxy<UserRepository>>(UserRepository);
    encryptService = module.get<DeepMockProxy<EncryptService>>(EncryptService);
    jwtService = module.get<DeepMockProxy<JwtService>>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp()', () => {
    it('should return a new user with access token', async () => {
      repository.create.mockResolvedValue(regularUserMock);
      encryptService.encrypt.mockResolvedValue('');
      jwtService.sign.mockReturnValue('');

      const user = await service.signUp({
        name: regularUserMock.name,
        email: regularUserMock.email,
        password: regularUserMock.password,
        caloriesPerDay: regularUserMock.config.caloriesPerDay,
      });

      expect(user).toBeDefined();
      expect(user).toEqual(regularAuthUserMock);
      expect(user).toBeInstanceOf(AuthUserEntity);
      expect(repository.create).toHaveBeenCalledTimes(1);
      expect(encryptService.encrypt).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
    });
  });

  describe('signIn()', () => {
    it('should return the authenticated user with access token', async () => {
      repository.findByEmail.mockResolvedValue(regularUserMock);
      encryptService.matches.mockResolvedValue(true);
      jwtService.sign.mockReturnValue('');

      const user = await service.signIn(regularUserMock.email, regularUserMock.password);

      expect(user).toBeDefined();
      expect(user).toEqual(regularAuthUserMock);
      expect(user).toBeInstanceOf(AuthUserEntity);
      expect(repository.findByEmail).toHaveBeenCalledTimes(1);
      expect(encryptService.matches).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
    });

    it('should throw an unauthorized exception if passwords not match', async () => {
      repository.findByEmail.mockResolvedValue(regularUserMock);
      encryptService.matches.mockResolvedValue(false);

      try {
        await service.signIn(regularUserMock.email, regularUserMock.password);
      } catch (e) {
        expect(e).toBeDefined();
        expect(e).toBeInstanceOf(UnauthorizedException);
        expect(repository.findByEmail).toHaveBeenCalledTimes(1);
        expect(encryptService.matches).toHaveBeenCalledTimes(1);
      }
    });
  });
});
