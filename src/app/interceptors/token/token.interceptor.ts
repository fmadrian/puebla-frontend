import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';;
import { catchError, switchMap, take, filter, finalize } from 'rxjs/operators';
import { AuthService } from '../../services/auth/auth.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { API_ENDPOINTS } from '../../consts/ApiEndpoints';
import { AuthResponse } from '../../dtos/responses/auth/auth.response';
import { APP_ROUTES } from '../../consts/AppRoutes';
import { APIResponse } from '../../dtos/responses/response';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {
  isBlockingRequests = false; // Block the ongoing calls
  
  constructor(private authService: AuthService, private router: Router) { }
  // What TokenInterceptor has to do when it intercepts a request
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    /* 
        If we are making an API call the login endpoint (api/auth/login),
        we don't need an authorization token in the request.
    */
    if (
      req.url.indexOf(API_ENDPOINTS.auth.login) !== -1
    ) {
      return next.handle(req).pipe(
        catchError((error) => {
          return this.handleHttpError(error);
        })
      );
    }
    // After this point, every request has to include the jwtToken.

    // 1. Retrieve the auth token.
    // 2. If the token is valid, we add it into the authorization headers.
    // 3. Clone the token and include the authorization header (this.addToken()).
    // 4. We use the cloned request (w/ authorization header included).
    const jwtToken = this.authService.getJwt();
    if (jwtToken) {
      // If the error, 401 is an "Forbidden" our JWT has expired and we have to login again.
      let interceptedRequest = this.addToken(req, jwtToken);
      return next.handle(interceptedRequest).pipe(
        catchError((error) => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            return this.handleAuthErrors(req, next);
          } else {
            return this.handleHttpError(error);
          }
        })
      );
    }
    // 5. If the request doesn't need a token, the request is returned without any change (unless there's an HTTP error).
    return next.handle(req).pipe(
      catchError((error) => {
        return this.handleHttpError(error.message);
      })
    );
  }

  // Adds the authentication token to the request.
  addToken(req: HttpRequest<any>, jwtToken: string) {
    // The request object is inmutable (we can't make changes in it)
    // We clone the request and add the authorization header
    return req.clone({
      headers: req.headers.set('Authorization', `Bearer ${jwtToken}`),
    });
  }
  /**
   * Clear the local storage if there is an authentication error.
   */
  private handleAuthErrors(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<any> {
    // Clear storage and redirect to login page.
    this.authService.logout();
    this.router.navigateByUrl(APP_ROUTES.auth.login.route);
    return of(false);
  }

  // Function that receives an http error and returns an error array.
  private handleHttpError(error: HttpErrorResponse) {
    // If we receive a 404 error, return the error object included in the response.
    if (error !== undefined) {
      switch (error.status) {
        case 0:
          return throwError(() => [error.message]);
        case 403:
        case 404:
          return throwError(() => [error.statusText]);
        case 400:
        case 500:
          if (error.error.errors !== undefined) {
            let errors = [];
            // Dictionary with errors [ErrorType:string]: [Message:string]
            // Concatenate all errors before returning them.
            for (let key in error.error.errors) {
              errors.push(error.error.errors[key]);
            }
            return throwError(() => errors);
          }
          return throwError(() => [error.statusText]);
        default:
          return throwError(() => [error]);
      }
    }
    return throwError(() => ['[ERRNOOBJ] - Unknown error.']); // Error, but no error object.
  }
}
