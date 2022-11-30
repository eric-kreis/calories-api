import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma, Roles } from '@prisma/client';
import { PrismaService } from '@services/prisma.service';
import { CreateUserDTO } from '../../../user/dto/create-user.dto';
import { FindUsersDTO } from '../../../user/dto/find-users.dto';
import { UpdateUserDTO } from '../../../user/dto/update-user.dto';
import { UserEntity } from '../../../user/entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(private readonly _prisma: PrismaService) {}

  public async create({
    name,
    email,
    password,
    caloriesPerDay,
  }: CreateUserDTO): Promise<UserEntity> {
    const userByEmail = await this._prisma.user.findUnique({ where: { email } });
    if (userByEmail) throw new ConflictException('Email already registred');

    return this._prisma.user.create({
      data: {
        name,
        email,
        password,
        role: Roles.REGULAR,
        config: { caloriesPerDay },
      },
    });
  }

  public async findAll({
    page,
    count,
    order,
    orderBy,
    name,
    email,
    role,
  }: FindUsersDTO) {
    return this._prisma.user.findMany({
      where: { name, email, role },
      take: count,
      skip: page * count,
      orderBy: { [orderBy]: order },
    });
  }

  public async findOne(id: string): Promise<UserEntity> {
    return this._prisma.user.findUniqueOrThrow({ where: { id } });
  }

  public async findByEmail(email: string): Promise<UserEntity> {
    return this._prisma.user.findUniqueOrThrow({ where: { email } });
  }

  public async update(
    id: string,
    {
      name,
      email,
      password,
      role,
      caloriesPerDay,
    }: UpdateUserDTO,
  ) {
    await this._prisma.user.findUniqueOrThrow({ where: { id } });

    if (email) {
      const userFromEmail = await this._prisma.user.findUnique({ where: { email } });
      if (userFromEmail) throw new ConflictException('Email already registred');
    }

    const data: Prisma.UserUpdateInput = {
      name,
      email,
      password,
      role,
    };

    if (caloriesPerDay) {
      data.config = { caloriesPerDay };
    }

    return this._prisma.user.update({
      where: { id },
      data,
    });
  }

  public async delete(id: string) {
    await this._prisma.user.findUniqueOrThrow({ where: { id } });
    return this._prisma.user.delete({ where: { id } });
  }
}
