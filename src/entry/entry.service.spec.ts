import { entriesMock, entryMock } from '@mocks/entry.mock';
import { nutrionixFoodsMock } from '@mocks/nutrionix-api.mock';
import { adminRequestUserMock, regularRequestUserMock } from '@mocks/request-user.mock';
import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EntryRepository } from '@repositories/entries/entry.repository';
import { NutrionixAPIService } from '@services/nutrionix-api/nutrionix-api.service';
import { RoleService } from '@services/role.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { CreateEntryDTO } from './dto/create-entry.dto';
import { FindEntriesDTO } from './dto/find-entries.dto';
import { EntryService } from './entry.service';

describe('EntryService', () => {
  let service: EntryService;
  let repository: DeepMockProxy<EntryRepository>;
  let nutrionixAPIService: DeepMockProxy<NutrionixAPIService>;

  beforeEach(async () => {
    const entryRepositoryMock = mockDeep<NutrionixAPIService>();
    const nutrioixAPIServiceMock = mockDeep<NutrionixAPIService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EntryService,
        RoleService,
        {
          provide: EntryRepository,
          useValue: entryRepositoryMock,
        },
        {
          provide: NutrionixAPIService,
          useValue: nutrioixAPIServiceMock,
        },
      ],
    }).compile();

    service = module.get<EntryService>(EntryService);
    repository = module.get<DeepMockProxy<EntryRepository>>(EntryRepository);
    nutrionixAPIService = module.get<DeepMockProxy<NutrionixAPIService>>(NutrionixAPIService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    const createEntryPayload: CreateEntryDTO = {
      date: entryMock.date,
      text: entryMock.text,
      time: entryMock.time,
    };

    it('should return the created entry', async () => {
      repository.create.mockResolvedValue(entryMock);

      const createdEntry = await service.create(
        { ...createEntryPayload, calories: entryMock.calories },
        regularRequestUserMock,
      );

      expect(createdEntry).toBeDefined();
      expect(createdEntry).toEqual(entryMock);
      expect(repository.create).toHaveBeenCalled();
      expect(repository.create).toHaveBeenCalledTimes(1);
    });

    it('should return the created with calories from API if calories was not provided', async () => {
      repository.create.mockResolvedValue(entryMock);
      nutrionixAPIService.findFoods.mockResolvedValue(nutrionixFoodsMock);

      const createdEntry = await service.create(createEntryPayload, regularRequestUserMock);

      expect(createdEntry).toBeDefined();
      expect(createdEntry).toEqual(entryMock);
      expect(repository.create).toHaveBeenCalled();
      expect(repository.create).toHaveBeenCalledTimes(1);
      expect(repository.create).toHaveBeenCalledWith({
        ...createEntryPayload,
        calories: nutrionixFoodsMock[0].calories + nutrionixFoodsMock[1].calories,
        expectedCaloriesPerDay: regularRequestUserMock.caloriesPerDay,
        userId: regularRequestUserMock.id,
      });
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
      repository.findAll.mockResolvedValue(entriesMock);

      const entries = await service.findAll(findEntriesPayload, regularRequestUserMock);

      expect(entries).toBeDefined();
      expect(entries).toEqual(entriesMock);
      expect(repository.findAll).toHaveBeenCalled();
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return entries if an admin search for regular user\'s entries', async () => {
      repository.findAll.mockResolvedValue(entriesMock);

      const entries = await service.findAll(
        { ...findEntriesPayload, userId: regularRequestUserMock.id },
        adminRequestUserMock,
      );

      expect(entries).toBeDefined();
      expect(entries).toEqual(entriesMock);
      expect(repository.findAll).toHaveBeenCalled();
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should throw a forbidden exception if a regular do not have enough permission', async () => {
      repository.findAll.mockResolvedValue(entriesMock);

      try {
        await service.findAll(
          { ...findEntriesPayload, userId: adminRequestUserMock.id },
          regularRequestUserMock,
        );
      } catch (e) {
        expect(e).toBeDefined();
        expect(e).toBeInstanceOf(ForbiddenException);
      }
    });
  });

  describe('findOne()', () => {
    it('should return a entry', async () => {
      repository.findOne.mockResolvedValue(entryMock);

      const entry = await service.findOne(entryMock.id, regularRequestUserMock);

      expect(entry).toBeDefined();
      expect(entry).toEqual(entryMock);
      expect(repository.findOne).toHaveBeenCalled();
      expect(repository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return a entry if an admin try to find a regular users\'s entry', async () => {
      repository.findOne.mockResolvedValue(entryMock);

      const entry = await service.findOne(entryMock.id, adminRequestUserMock);

      expect(entry).toBeDefined();
      expect(entry).toEqual(entryMock);
      expect(repository.findOne).toHaveBeenCalled();
      expect(repository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw a forbidden exception if a regular do not have enough permission to update an entry', async () => {
      repository.findOne.mockResolvedValue({ ...entryMock, userId: adminRequestUserMock.id });

      try {
        await service.findOne(entryMock.id, regularRequestUserMock);
      } catch (e) {
        expect(e).toBeDefined();
        expect(e).toBeInstanceOf(ForbiddenException);
        expect(repository.findOne).toHaveBeenCalled();
        expect(repository.findOne).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('update()', () => {
    it('should return the updated entry', async () => {
      repository.findOne.mockResolvedValue(entryMock);
      repository.update.mockResolvedValue(entryMock);

      const entry = await service.update(entryMock.id, {}, regularRequestUserMock);

      expect(entry).toBeDefined();
      expect(entry).toEqual(entryMock);
      expect(repository.findOne).toHaveBeenCalled();
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.update).toHaveBeenCalled();
      expect(repository.update).toHaveBeenCalledTimes(1);
    });

    it('should return the updated entry if an admin try to update a regular users\'s entry', async () => {
      repository.findOne.mockResolvedValue(entryMock);
      repository.update.mockResolvedValue(entryMock);

      const entry = await service.update(entryMock.id, {}, adminRequestUserMock);

      expect(entry).toBeDefined();
      expect(entry).toEqual(entryMock);
      expect(repository.findOne).toHaveBeenCalled();
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.update).toHaveBeenCalled();
      expect(repository.update).toHaveBeenCalledTimes(1);
    });

    it('should throw a forbidden exception if a regular do not have enough permission to update an entry', async () => {
      repository.findOne.mockResolvedValue({ ...entryMock, userId: adminRequestUserMock.id });

      try {
        await service.update(entryMock.id, {}, regularRequestUserMock);
      } catch (e) {
        expect(e).toBeDefined();
        expect(e).toBeInstanceOf(ForbiddenException);
        expect(repository.findOne).toHaveBeenCalled();
        expect(repository.findOne).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('delete()', () => {
    it('should return the deleted entry', async () => {
      repository.delete.mockResolvedValue(entryMock);
      repository.findOne.mockResolvedValue(entryMock);

      const deletedEntry = await service.delete(entryMock.id, regularRequestUserMock);

      expect(deletedEntry).toBeDefined();
      expect(deletedEntry).toEqual(entryMock);
      expect(repository.delete).toHaveBeenCalled();
      expect(repository.delete).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalled();
      expect(repository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return the deleted entry if an admin try to delete a regular users\'s entry', async () => {
      repository.findOne.mockResolvedValue(entryMock);
      repository.delete.mockResolvedValue(entryMock);

      const deletedEntry = await service.delete(entryMock.id, adminRequestUserMock);

      expect(deletedEntry).toBeDefined();
      expect(deletedEntry).toEqual(entryMock);
      expect(repository.delete).toHaveBeenCalled();
      expect(repository.delete).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalled();
      expect(repository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw a forbidden exception if a regular do not have enough permission to delete an entry', async () => {
      repository.findOne.mockResolvedValue({ ...entryMock, userId: adminRequestUserMock.id });

      try {
        await service.delete(entryMock.id, regularRequestUserMock);
      } catch (e) {
        expect(e).toBeDefined();
        expect(e).toBeInstanceOf(ForbiddenException);
        expect(repository.findOne).toHaveBeenCalled();
        expect(repository.findOne).toHaveBeenCalledTimes(1);
      }
    });
  });
});
