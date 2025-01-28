export interface UserResponse {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    nationalId: string;
    email: string;
    roles: string[];
    isEnabled: boolean;
}