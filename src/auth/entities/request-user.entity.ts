import { Roles } from '@prisma/client';

export class RequestUserEntity {
  id: string;

  email: string;

  role: keyof typeof Roles;

  caloriesPerDay: number;
}
