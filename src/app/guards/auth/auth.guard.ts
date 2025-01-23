import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { APP_ROUTES } from '../../../consts/AppRoutes';

/**
 * Searches through the APP_ROUTES to obtain the route object according to a path.
 * @param path Array with the path to the route we want to enter.
 * @param route APP_ROUTES object. Don't pass a parameter
 * @returns Route with respective roles and the string route.
 */
const searchRoute = (path: string[], route: any = APP_ROUTES): any => {
  // Keep digging into the object until it finds the route.
  if (path.length === 0)
    return route;
  else
    return searchRoute(path.slice(1), route[path[0]]);
}

export const authGuard: CanActivateFn = (route, state) => {
  console.log('auth guard started...');
  // Inject dependencies.
  const authService = inject(AuthService);
  const router = inject(Router);

  const fullPath = route.routeConfig?.path;
  // When dealing with :id in updates, remove the parameter ':id' in all but the auth page where we need
  // to add an 'Any' to match it with its respective route.
  const path = fullPath?.replace("/:id", fullPath.includes('auth') && fullPath.includes('update') ? 'Any' : '').split('/');

  if (path) {
    if (authService.isLoggedIn()) {
      // When authenticated, trying to get into login will redirect home.
      if (path.length == 1 && path[0] === APP_ROUTES.auth.login.route) {
        router.navigateByUrl(APP_ROUTES.main.home.route);
      }
      // Going to home route.
      else if (path.length == 1 && path[0] === APP_ROUTES.main.home.route)
        return true;

      // Obtain the route we are accessing to and verify the user has the roles to enter.
      const routeInObject = searchRoute(path);
      if (path.length > 1) {
        for (let i = 0; i < authService.getCurrentUserRoles().length; i++) {
          if (routeInObject.roles.includes(authService.getCurrentUserRoles()[i]))
            return true;
        }
        // Not allowed return the user to home.
        router.navigateByUrl(APP_ROUTES.main.home.route);
      }
    } else {
      // If we're not logged in or trying to recover the password, get redirected to login.
      if (fullPath !== APP_ROUTES.auth.login.route &&
        fullPath !== APP_ROUTES.auth.recoverPassword.route && 
        fullPath !== APP_ROUTES.auth.signup.route
      )
        router.navigateByUrl(APP_ROUTES.auth.login.route);
    }
  }
  return true;
};

