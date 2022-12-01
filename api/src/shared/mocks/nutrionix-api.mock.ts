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
