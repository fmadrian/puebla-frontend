export interface UpdateUserRequest {
    username: string,
    email: string,
    password: string,
    currentPassword: string,
    firstName: string,
    lastName: string,
    //nationalId: string,
    role: string,
}