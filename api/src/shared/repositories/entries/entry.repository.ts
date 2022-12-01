import { CreateEntryDTO } from '@entry/dto/create-entry.dto';
import { FindEntriesDTO } from '@entry/dto/find-entries.dto';
import { UpdateEntryDTO } from '@entry/dto/update-entry.dto';
import { EntryEntity } from '@entry/entities/entry.entity';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@services/prisma.service';

export interface CreateEntryType extends CreateEntryDTO {
  calories: number;
  userId: string;
  expectedCaloriesPerDay: number;
}

export interface UpdateEntryType extends UpdateEntryDTO {
  expectedCaloriesPerDay: number;
}

@Injectable()
export class EntryRepository {
  constructor(private readonly _prisma: PrismaService) { }

  public async create({
    text,
    date,
    time,
    calories,
    userId,
    expectedCaloriesPerDay,
  }: CreateEntryType): Promise<EntryEntity> {
    const lessThanExpected = await this._caloriesExcedeed(
      date,
      calories,
      expectedCaloriesPerDay,
      userId,
    );

    return this._prisma.entry.create({
      data: {
        text,
        date,
        time,
        calories,
        userId,
        lessThanExpected,
      },
    });
  }

  public async findAll({
    startDate,
    endDate,
    lessThanExpected,
    page,
    count,
    orderBy,
    order,
    userId,
  }: FindEntriesDTO) {
    return this._prisma.entry.findMany({
      where: {
        userId,
        lessThanExpected,
        date: { gte: startDate, lte: endDate },
      },
      take: count,
      skip: page * count,
      orderBy: { [orderBy]: order },
    });
  }

  public async findOne(id: string) {
    return this._prisma.entry.findUniqueOrThrow({ where: { id } });
  }

  public async update(
    id: string,
    {
      text,
      date,
      time,
      calories,
      expectedCaloriesPerDay,
    }: UpdateEntryType,
    oldEntry: EntryEntity,
  ): Promise<EntryEntity> {
    const data: Prisma.EntryUpdateInput = {
      text,
      date,
      time,
      calories,
    };

    if (calories) {
      if (!date) date = oldEntry.date;

      data.lessThanExpected = await this._caloriesExcedeed(
        date,
        calories - oldEntry.calories,
        expectedCaloriesPerDay,
        oldEntry.userId,
      );
    }

    return this._prisma.entry.update({ where: { id }, data });
  }

  public async delete(id: string): Promise<EntryEntity> {
    return this._prisma.entry.delete({ where: { id } });
  }

  // TODO: Move to service layer;
  private async _caloriesExcedeed(
    date: Date,
    calories: number,
    expectedUserCalories: number,
    userId: string,
  ) {
    const dayEntries = await this._prisma.entry.findMany({ where: { date, userId } });

    const dayCalories = dayEntries.reduce((acc, { calories: entryCalories }) => (
      acc + entryCalories
    ), calories);
    return expectedUserCalories > dayCalories;
  }
}
