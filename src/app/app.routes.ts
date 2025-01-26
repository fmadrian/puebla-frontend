import { Routes } from '@angular/router';
import { authGuard } from './guards/auth/auth.guard';
import { APP_ROUTES } from '../consts/AppRoutes';

export const routes: Routes = [
    { path: APP_ROUTES.main.home.route, loadComponent: () => import('./pages/main/home-page/home-page.component').then(c => c.HomePageComponent), canActivate: [authGuard], },

    // Authentication pages.
    { path: APP_ROUTES.auth.login.route, loadComponent: () => import('./pages/auth/login-page/login-page.component').then(c => c.LoginPageComponent), canActivate: [authGuard] },
    { path: APP_ROUTES.auth.recoverPassword.route, loadComponent: () => import('./pages/auth/recover-password-page/recover-password-page.component').then(c => c.RecoverPasswordPageComponent), canActivate: [authGuard] },
    { path: APP_ROUTES.auth.signup.route, loadComponent: () => import('./pages/auth/signup-page/signup-page.component').then(c => c.SignupPageComponent), canActivate: [authGuard] },
    { path: APP_ROUTES.auth.confirmEmail.route, loadComponent: () => import('./pages/auth/confirm-email-page/confirm-email-page.component').then(c => c.ConfirmEmailPageComponent), canActivate: [authGuard] },

    // Not found page (/404).
    { path: APP_ROUTES.main.notFound.route, loadComponent: () => import('./pages/main/not-found-page/not-found-page.component').then(c => c.NotFoundPageComponent) },
    // Any not found route redirects to /404.
    { path: '**', redirectTo: '/not-found' },

];
