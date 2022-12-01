export interface NutrionixNaturalNutrientsResponse {
  foods: {
    food_name: string;
    serving_qty: number;
    serving_unit: string;
    nf_calories: number;
  }[];
}
