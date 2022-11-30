import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDTO } from '@user/dto/create-user.dto';
import { UserEntity } from '@user/entities/user.entity';
import { UserService } from '@user/user.service';
import { Express } from 'express';
import { AuthService } from './auth.service';
import { SignInDTO } from './dtos/signIn.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _userService: UserService,
  ) {}

  @Post('signUp')
  public async signUp(@Body() signUpPayload: CreateUserDTO): Promise<UserEntity> {
    return this._authService.signUp(signUpPayload);
  }

  @Post('signIn')
  public async signIn(@Body() signInPayload: SignInDTO): Promise<UserEntity> {
    return this._authService.signIn(signInPayload.email, signInPayload.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  public profile(@Request() req: Express.Request) {
    return this._userService.findOne(req.user.id, req.user);
  }
}
