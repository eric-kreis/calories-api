import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserRepository } from '@repositories/user/user.repository';
import { RoleService } from '@services/role.service';
import { RequestUserEntity } from 'src/auth/entities/request-user.entity';
import { FindUsersDTO } from './dto/find-users.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _roleService: RoleService,
  ) { }

  public async findAll(query: FindUsersDTO): Promise<UserEntity[]> {
    const users = await this._userRepository.findAll(query);
    return users.map((user) => new UserEntity(user));
  }

  public async findOne(id: string, reqUser: RequestUserEntity): Promise<UserEntity> {
    this._canAccessResource(id, reqUser);
    const user = await this._userRepository.findOne(id);

    return new UserEntity(user);
  }

  public async update(
    id: string,
    data: UpdateUserDTO,
    reqUser: RequestUserEntity,
  ): Promise<UserEntity> {
    this._canAccessResource(id, reqUser);
    await this._userRepository.findOne(id);

    if (data.role && !this._roleService.isAdmin(reqUser.role)) {
      throw new ForbiddenException('You cannot update roles');
    }

    const updatedUser = await this._userRepository.update(id, data);

    return new UserEntity(updatedUser);
  }

  public async delete(id: string, reqUser: RequestUserEntity): Promise<UserEntity> {
    this._canAccessResource(id, reqUser);
    const userToDelete = await this._userRepository.findOne(id);

    const cannotDelete = (
      this._roleService.isManager(reqUser.role)
      && !this._roleService.isRegular(userToDelete.role)
    );

    if (cannotDelete) {
      throw new ForbiddenException('You cannot delete this user');
    }

    const deletedUser = await this._userRepository.delete(id);

    return new UserEntity(deletedUser);
  }

  private _canAccessResource(resourceId: string, reqUser: RequestUserEntity): void {
    const hasAccess = (
      this._roleService.isAdminOrManager(reqUser.role)
      || this._roleService.canAccessResouce(resourceId, reqUser.id)
    );

    if (!hasAccess) {
      throw new ForbiddenException('Forbidden resource');
    }
  }
}
