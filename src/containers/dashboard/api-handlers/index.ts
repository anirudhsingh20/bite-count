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

export const getLoggedMeals = async (userId: string, queryParamsString: string) => {
    const {data} = await apiClient.get(`${ENDPOINTS.loggedMeals.get(userId)}${queryParamsString ? `?${queryParamsString}` : ''}`);
    return data;
};

export interface BulkFoodLogItem {
    meal: string; // Reference to Meal ID
    quantity: number; // How many servings
    notes?: string;
  }
  
  export interface CreateBulkFoodLogRequest {
    user: string;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    items: BulkFoodLogItem[];
    loggedAt?: number;
    logDate: number;
    notes?: string; // General notes for the entire bulk log
  }

  export interface BulkFoodLogResponse {
    success: boolean;
    data: {
      createdLogs: FoodLog[];
      totalItems: number;
      totalCalories: number;
      totalProtein: number;
      totalFat: number;
      totalCarbs: number;
      mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
      loggedAt: Date;
    };
    message: string;
  }

  // check and update ... make sure to use this in all the places where food log is used (replace in other places)
  export interface FoodLog {
    _id: string;
    user: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    meal: any; // Reference to Meal ID // check and update ... make sure to use this in all the places where meal is used
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'; // check and update ... make sure to use this in all the places where meal type is used
    quantity: number; // How many servings
    loggedAt: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
  }

export const logMeals = async (requestBody: CreateBulkFoodLogRequest): Promise<BulkFoodLogResponse> => {
    const {data} = await apiClient.post(ENDPOINTS.loggedMeals.logBulk, requestBody);
    return data;
};