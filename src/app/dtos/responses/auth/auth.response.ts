export interface AuthResponse {
    token: string;
    roles: string[]
    // Other fields.
    username: string,
    firstName: string,
    lastName: string,
    email: string
}