import { environment } from "../environments/environment"

const BASE_API_ROUTES = {
    auth: `${environment.API_URL}/auth`,
}
/**
 * API's endpoints we are going to call.
 */
export const API_ENDPOINTS = {
    auth: {
        login: `${BASE_API_ROUTES.auth}/login`,
        signup: `${BASE_API_ROUTES.auth}/signup`,
        logout: `${BASE_API_ROUTES.auth}/logout`,
        roles: `${BASE_API_ROUTES.auth}/roles`,
        getUsers: `${BASE_API_ROUTES.auth}/users`,
        getUser: (id: string) => `${BASE_API_ROUTES.auth}/users/${id}`,
        getCurrentUser: `${BASE_API_ROUTES.auth}/users/me`,
        update: `${BASE_API_ROUTES.auth}/users/me`,
        updateAny: (id: string) => `${BASE_API_ROUTES.auth}/users/${id}`,
        recoverPassword: `${BASE_API_ROUTES.auth}/recover-password`,
        toggle: (id: string) => `${BASE_API_ROUTES.auth}/users/${id}/toggle`,
        confirmEmail: (code: string) => `${BASE_API_ROUTES.auth}/confirm/${code}`,
        delete: (id: string) => `${BASE_API_ROUTES.auth}/users/${id}`
    },
}