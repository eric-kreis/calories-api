import { SetMetadata } from '@nestjs/common';
import { Roles } from '@prisma/client';

export const AUTHORIZE_KEY = 'roles';
export const Authorize = (...roles: Roles[]) => SetMetadata(AUTHORIZE_KEY, roles);
