import { Expose } from 'class-transformer';

export class NutrionixFoodEntity {
  @Expose({ name: 'food_name' })
  foodName: string;

  @Expose({ name: 'servingQty' })
  quantity: number;

  @Expose({ name: 'serving_unit' })
  servingUnit: string;

  @Expose({ name: 'nf_calories' })
  calories: number;
}
