import { Entry as EntryModel } from '@prisma/client';

export class EntryEntity implements EntryModel {
  id: string;

  createdAt: Date;

  updatedAt: Date;

  date: Date;

  time: string;

  text: string;

  calories: number;

  lessThanExpected: boolean;

  userId: string;

  constructor(partial: Partial<EntryEntity>) {
    Object.assign(this, partial);
  }
}
