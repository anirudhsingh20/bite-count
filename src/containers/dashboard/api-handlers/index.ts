import { apiClient, ENDPOINTS } from "../../../config/api";

export const getMealTypes = async () => {
    const {data} = await apiClient.get(ENDPOINTS.mealsType.get);
    return data;
};
