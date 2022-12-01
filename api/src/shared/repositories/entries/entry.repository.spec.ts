import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@services/prisma.service';
import { regularRequestUserMock } from '@mocks/request-user.mock';
import { entriesMock, entryMock } from '@mocks/entry.mock';
import { FindEntriesDTO } from '@entry/dto/find-entries.dto';
import { CreateEntryType, EntryRepository, UpdateEntryType } from './entry.repository';

describe('EntryRepository', () => {
  let repository: EntryRepository;
  let prismaService: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const prismaServiceMock = mockDeep<PrismaService>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EntryRepository,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    repository = module.get<EntryRepository>(EntryRepository);
    prismaService = module.get<DeepMockProxy<PrismaService>>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create()', () => {
    const createEntryPayload: CreateEntryType = {
      userId: entryMock.userId,
      calories: entryMock.calories,
      date: entryMock.date,
      text: entryMock.text,
      time: entryMock.time,
      expectedCaloriesPerDay: regularRequestUserMock.caloriesPerDay,
    };

    it('should create an entry', async () => {
      prismaService.entry.findMany.mockResolvedValue(entriesMock);
      prismaService.entry.create.mockResolvedValue(entryMock);

      const createdEntry = await repository.create(createEntryPayload);

      expect(createdEntry).toBeDefined();
      expect(createdEntry).toEqual(entryMock);
      expect(prismaService.entry.create).toHaveBeenCalled();
      expect(prismaService.entry.create).toHaveBeenCalledTimes(1);
      expect(prismaService.entry.findMany).toHaveBeenCalled();
      expect(prismaService.entry.findMany).toHaveBeenCalledTimes(1);
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
      prismaService.entry.findMany.mockResolvedValue(entriesMock);

      const entries = await repository.findAll(findEntriesPayload);

      expect(entries).toBeDefined();
      expect(entries).toEqual(entriesMock);
      expect(prismaService.entry.findMany).toHaveBeenCalled();
      expect(prismaService.entry.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne()', () => {
    it('should return an entry', async () => {
      prismaService.entry.findUniqueOrThrow.mockResolvedValue(entryMock);

      const entry = await repository.findOne(entryMock.id);

      expect(entry).toBeDefined();
      expect(entry).toEqual(entryMock);
      expect(prismaService.entry.findUniqueOrThrow).toHaveBeenCalled();
      expect(prismaService.entry.findUniqueOrThrow).toHaveBeenCalledTimes(1);
    });
  });

  describe('update()', () => {
    const updateEntryPayload: UpdateEntryType = {
      calories: 100,
      userId: regularRequestUserMock.id,
      expectedCaloriesPerDay: regularRequestUserMock.caloriesPerDay,
    };

    it('should update an entry', async () => {
      prismaService.entry.update.mockResolvedValue(entryMock);
      prismaService.entry.findMany.mockResolvedValue(entriesMock);

      const updatedEntry = await repository.update(entryMock.id, updateEntryPayload, entryMock);

      expect(updatedEntry).toBeDefined();
      expect(updatedEntry).toEqual(entryMock);
      expect(prismaService.entry.update).toHaveBeenCalled();
      expect(prismaService.entry.update).toHaveBeenCalledTimes(1);
      expect(prismaService.entry.findMany).toHaveBeenCalled();
      expect(prismaService.entry.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete()', () => {
    it('should delete an entry', async () => {
      prismaService.entry.delete.mockResolvedValue(entryMock);

      const deletedEntry = await repository.delete(entryMock.id);

      expect(deletedEntry).toBeDefined();
      expect(deletedEntry).toEqual(entryMock);
      expect(prismaService.entry.delete).toHaveBeenCalled();
      expect(prismaService.entry.delete).toHaveBeenCalledTimes(1);
    });
  });
});
