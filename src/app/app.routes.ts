import { Routes } from '@angular/router';
import { authGuard } from './guards/auth/auth.guard';

export const routes: Routes = [
    //{ path: '', loadComponent: () => import('./pages/home-page/home-page.component').then(c => c.HomePageComponent), canActivate: [authGuard], },

    // Not found
    // { path: '404', component: NotFoundComponent },
    // Any not found route redirects to /404.
    // { path: '**', redirectTo: '/404' },
];
