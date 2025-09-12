import { BASE_URL } from "../constants";

export const ENDPOINTS = {
    auth: {
        login: '/auth/login',
        register: '/auth/register',
        logout: '/auth/logout',
        me: '/auth/me',
    },
    mealsType: {
        get: '/meals/types',
    },
};

export const getEndpoint = (endpoint: string) => {
    return `${BASE_URL}${endpoint}`;
};