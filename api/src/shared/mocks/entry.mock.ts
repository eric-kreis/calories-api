import { EntryEntity } from '@entry/entities/entry.entity';
import { regularUserMock } from './user.mock';

export const entryMock: EntryEntity = {
  id: '6242c4ae032bc76da100b201',
  createdAt: new Date(),
  updatedAt: new Date(),
  date: new Date(),
  calories: 200,
  lessThanExpected: false,
  text: 'For breakfast I ate two breads',
  time: '00:00',
  userId: regularUserMock.id,
};

export const entriesMock: EntryEntity[] = [entryMock];
