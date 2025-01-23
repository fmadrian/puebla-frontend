/**
 * Class used as an abstraction of the information needed in user signup and update, request and response.
 * 
 * This class can be used to convert the information from the user form to a request object.
 */
export class User {
    firstName: string;
    lastName: string;
    // nationalId: string;
    email: string;
    username: string;
    password: string;
    currentPassword?: string;
    role: string;
    isEnabled?: boolean;

    constructor(role: string = 'user') {
        this.firstName = '';
        this.lastName = '';
        // this.nationalId = '';
        this.email = '';
        this.username = '';
        this.password = '';
        this.role = role;
        this.isEnabled = false;
    }
}