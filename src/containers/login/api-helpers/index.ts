
import apiClient from "../../../config/api/axios";
import { ENDPOINTS } from "../../../config/api/endpoints";

const login = async (email: string, password: string) => {
    const {data} = await apiClient.post(ENDPOINTS.auth.login, {
        email,
        password,
    });

    return data;
};

export { login };
