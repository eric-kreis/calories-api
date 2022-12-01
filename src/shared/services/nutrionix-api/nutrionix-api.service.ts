import { HttpService } from '@nestjs/axios';
import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { NutrionixFoodEntity } from './entities/nutrionix-food.entity';
import { NutrionixNaturalNutrientsResponse } from './types/natural-nutrients.response';

@Injectable()
export class NutrionixAPIService {
  private readonly _naturalNutrientsPath = '/natural/nutrients';

  constructor(
    private readonly _httpService: HttpService,
  ) { }

  // TODO: Implement cache;
  public async findFoods(query: string): Promise<NutrionixFoodEntity[]> {
    try {
      const { data } = await this._httpService.axiosRef.post<NutrionixNaturalNutrientsResponse>(
        this._naturalNutrientsPath,
        { query },
      );

      // TODO: Improve serialization
      return data.foods.map((food) => plainToInstance(
        NutrionixFoodEntity,
        food,
        { excludeExtraneousValues: true },
      ));
    } catch (e) {
      if (e.response?.status === HttpStatus.NOT_FOUND) {
        throw new NotFoundException('No food was found');
      }
      throw new InternalServerErrorException(e.message);
    }
  }
}
