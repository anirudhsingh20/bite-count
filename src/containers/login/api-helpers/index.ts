
import { getEndpoint } from "../../../config/api/endpoints";
import { ENDPOINTS } from "../../../config/api/endpoints";
import apiClient from "../../../config/api/axios";

const login = async (email: string, password: string) => {
    const {data} = await apiClient.post(getEndpoint(ENDPOINTS.auth.login), {
        email,
        password,
    });

    return data;
};

export { login };