import { Injectable } from '@nestjs/common';
import { Roles } from '@prisma/client';

@Injectable()
export class RoleService {
  public isAdmin(role: Roles): boolean {
    return role === Roles.ADMIN;
  }

  public isManager(role: Roles): boolean {
    return role === Roles.MANAGER;
  }

  public isRegular(role: Roles): boolean {
    return role === Roles.REGULAR;
  }

  public isAdminOrManager(role: Roles): boolean {
    return role === Roles.ADMIN || role === Roles.MANAGER;
  }

  public canAccessResouce(userId: string, resourceUserId: string): boolean {
    return userId === resourceUserId;
  }
}
