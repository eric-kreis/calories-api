import { UserRepository } from '@repositories/user/user.repository';
import { EncryptService } from '@services/encrypt/encrypt.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from '@user/dto/create-user.dto';
import { AuthUserEntity } from './entities/auth-user.entity';
import { RequestUserEntity } from './entities/request-user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _encryptService: EncryptService,
    private readonly _jwtService: JwtService,
  ) {}

  public async signUp({ password, ...rest }: CreateUserDTO): Promise<AuthUserEntity> {
    const hashedPassword = await this._encryptService.encrypt(password);
    const createdUser = await this._userRepository.create({
      password: hashedPassword,
      ...rest,
    });
    const accessToken = this._createAccessToken({
      id: createdUser.id,
      email: createdUser.email,
      role: createdUser.role,
      caloriesPerDay: createdUser.config.caloriesPerDay,
    });

    return new AuthUserEntity(accessToken, createdUser);
  }

  public async signIn(email: string, password: string): Promise<AuthUserEntity> {
    try {
      const user = await this._userRepository.findByEmail(email);
      const passwordMatches = await this._encryptService.matches(password, user.password);

      if (!passwordMatches) throw new Error();

      const accessToken = this._createAccessToken({
        id: user.id,
        email: user.email,
        role: user.role,
        caloriesPerDay: user.config.caloriesPerDay,
      });

      return new AuthUserEntity(accessToken, user);
    } catch (e) {
      throw new UnauthorizedException('Wrong credentials provided');
    }
  }

  private _createAccessToken(payload: RequestUserEntity): string {
    return this._jwtService.sign(payload);
  }
}
