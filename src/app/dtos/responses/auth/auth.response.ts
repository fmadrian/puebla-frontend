export interface AuthResponse {
    token: string;
    refreshToken: string;
    roles: string[]
    // Other fields.
    username: string,
    firstName: string,
    lastName: string,
    email: string
}