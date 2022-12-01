import { NutrionixFoodEntity } from '@services/nutrionix-api/entities/nutrionix-food.entity';
import { NutrionixNaturalNutrientsResponse } from '@services/nutrionix-api/types/natural-nutrients.response';

export const nutrionixNaturalNutriensMock: NutrionixNaturalNutrientsResponse = {
  foods: [
    {
      food_name: 'mashed potato',
      serving_qty: 1,
      serving_unit: 'cup',
      nf_calories: 237.3,
    },
  ],
};

export const nutrionixFoodMock: NutrionixFoodEntity = {
  foodName: 'potato',
  quantity: 1,
  servingUnit: 'potato medium',
  calories: 160.89,
};

export const nutrionixFoodsMock: NutrionixFoodEntity[] = [
  nutrionixFoodMock,
  {
    foodName: 'mashed potato',
    quantity: 1,
    servingUnit: 'cup',
    calories: 237.3,
  },
];
