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
import { API_ENDPOINTS } from '../../../consts/ApiEndpoints';
import { AuthResponse } from '../../dtos/responses/auth/auth.response';
import { APP_ROUTES } from '../../../consts/AppRoutes';
import { APIResponse } from '../../dtos/responses/response';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {
  isTokenRefreshing = false; // Block the ongoing calls
  // We use BehaviorSubject instead of Subject or a Observable.
  // Because BehaviorSubject can have a value assigned to it so when we receive the new token from the
  // refresh token method, we can assign the token to the BehaviorSubject and access the new token inside the interceptor (token-interceptor).
  refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private authService: AuthService, private router: Router) { }
  // What TokenInterceptor has to do when it intercepts a request
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    /* 
        If we are making an API call to refresh the token or login endpoints (api/auth/login or .../api/auth/refresh),
        we don't need an authorization token in the request.
    */
    if (
      req.url.indexOf(API_ENDPOINTS.auth.refreshToken) !== -1 ||
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
      // If the error, 401 is an "Forbidden" error we must request a refresh token.
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
   * Prepare our client to make the refresh token call to the backend
   * When we make this call, we have to block temporarily block all the
   * outgoing backends calls for this user.
   *
   * Once we receive a new authentication token from our backend we are going
   * to release all the requests again.
   *
   */
  private handleAuthErrors(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<any> {
    // Blocks every incoming request when is asking for a new token.
    if (!this.isTokenRefreshing) {
      this.isTokenRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.newRefreshToken().pipe(
        // Avoid all outgoing requests being permanently blocked (HTTP 403)
        finalize(() => {
          this.isTokenRefreshing = false;
        }),
        switchMap((refreshTokenResponse: APIResponse<AuthResponse>) => {
          this.refreshTokenSubject.next(refreshTokenResponse.object.token);
          return next.handle(this.addToken(req, refreshTokenResponse.object.token)); // Returns the intercepted request with the new authorization token included.
        }), catchError((err) => {
          // If we try to get a new JWT, and the refresh token has expired, clear the storage and redirect user to login.
          this.authService.forceClearStorage();
          this.router.navigateByUrl(APP_ROUTES.auth.login.route);
          return of(false);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        // If the token is refreshing, and we receive the non-response request
        // we will acesss the first result (take(1)), and switchMap to take the new
        // token and use it to make the request.
        filter((result) => result !== null),
        take(1),
        switchMap((res) => {
          return next.handle(
            this.addToken(req, this.authService.getJwt())
          );
        })
      );
    }
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
    return throwError(() => ['Unknown error.']); // Error, but no error object.
  }
}
