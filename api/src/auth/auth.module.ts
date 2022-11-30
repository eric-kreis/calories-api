import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserRepositoryModule } from '@repositories/user/user.repository.module';
import { EncryptService } from '@services/encrypt/encrypt.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UserRepositoryModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '5d',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, EncryptService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
