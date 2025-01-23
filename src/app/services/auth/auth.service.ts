import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { map, of, switchMap, tap } from 'rxjs';
import { AuthResponse } from '../../dtos/responses/auth/auth.response';
import { SignupRequest } from '../../dtos/requests/auth/signup/signup.request';
import { APIResponse } from '../../dtos/responses/response';
import { SearchUserRequest } from '../../dtos/requests/user/search.user.request';
import { SearchResponse } from '../../dtos/responses/search.response';
import { UserResponse } from '../../dtos/responses/user/user.response';
import { UpdateUserRequest } from '../../dtos/requests/auth/update/update.request';
import { UpdateAnyUserRequest } from '../../dtos/requests/auth/update/update-any.request';
import { RecoverPasswordRequest } from '../../dtos/requests/auth/recover-password/recover-password.request';
import { API_ENDPOINTS } from '../../../consts/ApiEndpoints';
import { LoginRequest } from '../../dtos/requests/auth/login/login.request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Indicates if we logged in or signed out.
  @Output() authChanged = new EventEmitter<boolean>(false);
  @Output() user = new EventEmitter<AuthResponse>();

  constructor(
    private http: HttpClient,
    private localStorage: LocalStorageService
  ) { }
  /**
   * Signs a user up to the application.
   * @param request Request with information required to signup.
   * @returns Observable with response sent by API.
   */
  signup(request: SignupRequest) {
    return this.http.post<APIResponse<UserResponse>>(API_ENDPOINTS.auth.signup, request);
  }

  /**
   * Logs users into the application.
   * @param request Request with information required to login. 
   * @returns Observable with response sent by API.
   */
  login(request: LoginRequest) {
    return this.http
      .post<APIResponse<AuthResponse>>(API_ENDPOINTS.auth.login, request)
      .pipe(
        map((response) => {
          // If the response is successful, store the tokens.
          if (response.result === true) {
            this.localStorage.store('token', response.object.token);
            this.localStorage.store('roles', response.object.roles.toString()); // String where each role is separated by commas.
          }
          this.authChanged.next(response.result);
          return response;
        })
      );
  }
  /**
   * Clears the local storage.
   */
  logout() {
     // When a response is received, it cleans the storage
     this.localStorage.clear('token');
     this.localStorage.clear('roles');
 
     // Trigger the event emitters and pass the information to other components.
     this.authChanged.next(false);
     return of(true);
  }
  /**
   * Get a list of users.
   * @param request Request with query and pagination data.
   * @returns Observable that returns list of users.
   */
  getUsers(request: SearchUserRequest) {
    return this.http.get<APIResponse<SearchResponse<UserResponse>>>(API_ENDPOINTS.auth.getUsers,
      {
        params:
          { ...request }
      });
  }
  /**
   * 
   * @param id ID of the user to search.
   * @returns Observable that returns user object.
   */
  getUser(id: string) {
    return this.http.get<APIResponse<UserResponse>>(API_ENDPOINTS.auth.getUser(id));
  }
  /**
   * 
   * @returns Observable that returns currently logged in user object.
   */
  getCurrentUser() {
    return this.http.get<APIResponse<UserResponse>>(API_ENDPOINTS.auth.getCurrentUser);
  }
  /**
   * Updates user currently logged in.
   * @param request Updated user's information.
   * @returns Observable with new JWT built with the new information.
   */
  update(request: UpdateUserRequest) {
    return this.http.put<APIResponse<AuthResponse>>(API_ENDPOINTS.auth.update, request);
  }
  /**
   * Updates any user.
   * @param request Updated user's information.
   * @returns Observable with the response.
   */
  updateAny(id: string, request: UpdateAnyUserRequest) {
    return this.http.put<APIResponse<object>>(API_ENDPOINTS.auth.updateAny(id), request);
  }

  recoverPassword(request: RecoverPasswordRequest) {
    return this.http.put<APIResponse<object>>(API_ENDPOINTS.auth.recoverPassword, request);
  }
  /**
   * 
   * @param request  Recover password request.
   * @returns  
   */
  confirmEmail(code: string) {
    return this.http.get<APIResponse<object>>(API_ENDPOINTS.auth.confirmEmail(code));
  }

  toggle(id: string) {
    return this.http.put<APIResponse<object>>(API_ENDPOINTS.auth.toggle(id), null);
  }

  /**
   * Gets JWT in storage.
   * @returns JWT in storage or NO_STORED_TOKEN (if there isn't a token stored).
   */
  getJwt() {
    return this.localStorage.retrieve('token') ?? 'NO_STORED_TOKEN';
  }
  /**
   * Lets us know if the user is logged in or not by retrieving the JWT from storage.
   * @returns Boolean that indicates if user is logged in.
   */
  isLoggedIn(): boolean {
    return (
      this.localStorage.retrieve('token')
    );
  }
  /**
   * Retrieves list of roles of the user who is currently logged in.
   */
  getCurrentUserRoles(): string[] {
    const roles = this.localStorage.retrieve('roles');
    return roles ? roles.toLowerCase().split('/') : [];
  }
}
