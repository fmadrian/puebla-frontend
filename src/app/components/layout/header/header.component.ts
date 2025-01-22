import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { APP_HYPERLINKS, APP_ROUTES } from '../../../../consts/AppRoutes';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import { AuthService } from '../../../services/auth/auth.service';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [
    // Angular.
    RouterModule,
    // PrimeNG
    ButtonModule,
    RippleModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  APP_HYPERLINKS = APP_HYPERLINKS;

  @Input() username = '';
  @Input() isLoggedIn = false;
  // TODO: Replace with authservice object or function.
  user: {
    isLoggedIn: any,
    name: string
  }
    = {
      isLoggedIn: () => true,
      name: 'nombre'
    }
  constructor(private authService: AuthService, private router: Router) { }

  logout() {
    this.authService.logout().subscribe(
      {
        next: (response) => {
          if (response) {
            this.router.navigateByUrl(APP_ROUTES.auth.login.route)
          } else {
            throwError(() => 'Unknown error.')
          }
        },
        error: (error) => console.error(error)
      }
    )
  }
}
