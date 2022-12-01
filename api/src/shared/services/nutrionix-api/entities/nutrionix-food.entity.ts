import { Expose } from 'class-transformer';

export class NutrionixFoodEntity {
  @Expose({ name: 'food_name' })
  foodName: string;

  servingQty: number;

  @Expose({ name: 'serving_unit' })
  units: string;

  @Expose({ name: 'nf_calories' })
  calories: number;
}
