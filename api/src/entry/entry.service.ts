import { RequestUserEntity } from '@auth/entities/request-user.entity';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { NutrionixAPIService } from '@services/nutrionix-api/nutrionix-api.service';
import { EntryRepository } from '@repositories/entries/entry.repository';
import { RoleService } from '@services/role.service';
import { CreateEntryDTO } from './dto/create-entry.dto';
import { UpdateEntryDTO } from './dto/update-entry.dto';
import { EntryEntity } from './entities/entry.entity';
import { FindEntriesDTO } from './dto/find-entries.dto';

@Injectable()
export class EntryService {
  constructor(
    private readonly _nutrionixAPIService: NutrionixAPIService,
    private readonly _entryRepository: EntryRepository,
    private readonly _roleService: RoleService,
  ) {}

  public async create(
    {
      text,
      date,
      time,
      calories,
    }: CreateEntryDTO,
    reqUser: RequestUserEntity,
  ): Promise<EntryEntity> {
    if (!calories) calories = await this._getCaloriesFromAPI(text);

    return this._entryRepository.create({
      text,
      date,
      time,
      calories,
      expectedCaloriesPerDay: reqUser.caloriesPerDay,
      userId: reqUser.id,
    });
  }

  public async findAll(query: FindEntriesDTO, reqUser: RequestUserEntity): Promise<EntryEntity[]> {
    if (query.userId) this._canAccessResource(query.userId, reqUser);

    return this._entryRepository.findAll({
      ...query,
      userId: query.userId || reqUser.id,
    });
  }

  public async findOne(id: string, reqUser: RequestUserEntity): Promise<EntryEntity> {
    const entry = await this._entryRepository.findOne(id);
    this._canAccessResource(entry.userId, reqUser);

    return entry;
  }

  public async update(
    id: string,
    {
      text,
      date,
      time,
      calories,
    }: UpdateEntryDTO,
    reqUser: RequestUserEntity,
  ) {
    const oldEntry = await this._entryRepository.findOne(id);
    this._canAccessResource(oldEntry.userId, reqUser);

    return this._entryRepository.update(
      id,
      {
        text,
        date,
        time,
        calories,
        expectedCaloriesPerDay: reqUser.caloriesPerDay,
      },
      oldEntry,
    );
  }

  public async delete(id: string, reqUser: RequestUserEntity) {
    const entryToDelete = await this._entryRepository.findOne(id);
    this._canAccessResource(entryToDelete.userId, reqUser);

    return this._entryRepository.delete(id);
  }

  private async _getCaloriesFromAPI(text: string) {
    const foods = await this._nutrionixAPIService.findFoods(text);
    return foods.reduce((acc, { calories: foodCalory }) => acc + foodCalory, 0);
  }

  private _canAccessResource(resourseOwnerId: string, reqUser: RequestUserEntity): void {
    const hasAccess = (
      this._roleService.isAdmin(reqUser.role)
      || this._roleService.canAccessResouce(resourseOwnerId, reqUser.id)
    );

    if (!hasAccess) {
      throw new ForbiddenException('Forbidden resource');
    }
  }
}
