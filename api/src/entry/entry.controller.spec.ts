import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { EntryEntity } from '@entry/entities/entry.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { regularRequestUserMock } from '@mocks/request-user.mock';
import { entriesMock, entryMock } from '@mocks/entry.mock';
import { CreateEntryDTO } from './dto/create-entry.dto';
import { EntryController } from './entry.controller';
import { EntryService } from './entry.service';
import { FindEntriesDTO } from './dto/find-entries.dto';

describe('EntryController', () => {
  let controller: EntryController;
  let service: DeepMockProxy<EntryService>;

  beforeEach(async () => {
    const entryServiceMock = mockDeep<EntryService>();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EntryController],
      providers: [
        {
          provide: EntryService,
          useValue: entryServiceMock,
        },
      ],
    }).compile();

    controller = module.get<EntryController>(EntryController);
    service = module.get<DeepMockProxy<EntryService>>(EntryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    const payload: CreateEntryDTO = {
      date: new Date(),
      text: 'breakfast',
      time: '00:00',
    };
    it('should return the created entry', async () => {
      service.create.mockResolvedValue(entryMock);

      const entry = await controller.create(
        payload,
        { user: regularRequestUserMock } as any,
      );

      expect(entry).toBeDefined();
      expect(entry).toEqual(entryMock);
      expect(service.create).toHaveBeenCalled();
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll()', () => {
    const findEntriesPayload: FindEntriesDTO = {
      page: 0,
      count: 10,
      orderBy: 'calories',
      order: 'asc',
    };

    it('should return entries', async () => {
      service.findAll.mockResolvedValue(entriesMock);

      const entries = await controller.findAll(
        findEntriesPayload,
        { user: regularRequestUserMock } as any,
      );

      expect(entries).toBeDefined();
      expect(entries).toEqual(entriesMock);
      expect(service.findAll).toHaveBeenCalled();
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne()', () => {
    it('should return an entry', async () => {
      service.findOne.mockResolvedValue(entryMock);

      const entry = await controller.findOne(
        entryMock.id,
        { user: regularRequestUserMock } as any,
      );

      expect(entry).toBeDefined();
      expect(entry).toEqual(entryMock);
      expect(service.findOne).toHaveBeenCalled();
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('upadate()', () => {
    const updatedEntryPayload: EntryEntity = {
      id: entryMock.id,
      text: entryMock.text,
      calories: entryMock.calories,
      createdAt: entryMock.createdAt,
      time: entryMock.time,
      date: entryMock.date,
      updatedAt: entryMock.updatedAt,
      lessThanExpected: entryMock.lessThanExpected,
      userId: entryMock.userId,
    };

    it('should update an entry', async () => {
      service.update.mockResolvedValue(entryMock);

      const updatedEntry = await controller.update(
        entryMock.id,
        updatedEntryPayload,
        { user: regularRequestUserMock } as any,
      );

      expect(updatedEntry).toBeDefined();
      expect(updatedEntry).toEqual(entryMock);
      expect(service.update).toHaveBeenCalled();
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete()', () => {
    it('should return the deleted entry', async () => {
      service.delete.mockResolvedValue(entryMock);

      const entry = await controller.delete(
        entryMock.id,
        { user: regularRequestUserMock } as any,
      );

      expect(entry).toBeDefined();
      expect(entry).toEqual(entryMock);
      expect(service.delete).toHaveBeenCalled();
      expect(service.delete).toHaveBeenCalledTimes(1);
    });
  });
});
