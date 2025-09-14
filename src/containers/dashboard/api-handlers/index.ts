import type { FoodItem } from "../../../components/AddNewFoodModal";
import { apiClient, ENDPOINTS } from "../../../config/api";

export const getMealTypes = async () => {
    const {data} = await apiClient.get(ENDPOINTS.mealsType.get);
    return data;
};

export const addFood = async (food: FoodItem) => {
    const {data} = await apiClient.post(ENDPOINTS.meals.create, food);
    return data;
};

export const getFoods = async () => {
    const {data} = await apiClient.get(ENDPOINTS.meals.get);
    return data;
};