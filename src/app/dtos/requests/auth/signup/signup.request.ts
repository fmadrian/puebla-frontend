
export interface SignupRequest {
    firstName: string,
    lastName: string,
    //nationalId: string,
    email: string,
    username: string,
    password?: string,
    role: string
}