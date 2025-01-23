import { Component, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
// PrimeNG.
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { APP_ROUTES } from '../../../../consts/AppRoutes';
import { AuthService } from '../../../services/auth/auth.service';
import { finalize, throwError } from 'rxjs';
import { MessageboxComponent } from '../../../components/shared/messagebox/messagebox.component';
import { LoadingComponent } from '../../../components/shared/loading/loading.component';
import { ToastService } from '../../../services/toast/toast.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    // Angular
    ReactiveFormsModule,
    RouterLink,
    // Application components.
    MessageboxComponent,
    LoadingComponent,
    // PrimeNG 
    InputTextModule,
    PasswordModule,
    ButtonModule,
    RippleModule,
    ToastModule
  ], providers: [],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnDestroy {

  // Flags.
  isLoading = false;
  // Constants.
  APP_ROUTES = APP_ROUTES;
  // Form.
  loginForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  })
  /**
   * Errors to be shown to the user.
   * Reseted each time the user modifies values in the form to avoid
   * showing an error message while the user is typing.
   */
  errors = [];
  formValuesChanged$ = this.loginForm.valueChanges.subscribe(
    () => this.errors = []
  );

  constructor(private authService: AuthService, private router: Router, private toastService: ToastService) { }
  ngOnDestroy(): void {
    // Unsubscribe from observables.
    this.formValuesChanged$.unsubscribe();
  }

  login() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errors = [];
      this.authService.login({
        name: this.loginForm.get('name')?.value ?? '',
        password: this.loginForm.get('password')?.value ?? '',
      }).pipe(
        finalize(() => {
          this.isLoading = false;
        })
      ).subscribe(
        {
          next: (response) => {
            // If login is successful, redirect to home.
            if (response.result) {
              this.router.navigateByUrl(APP_ROUTES.main.home.route);
            } else if (response.errors.length > 0) {
              // Display all errors.
              throwError(() => response.errors);
            }
            else {
              // Result false, probably an unknown error.
              throwError(() => ['Unknown error.']);
            }
          },
          error: (error) => {
            this.errors = error;
            this.toastService.error("Couldn't login.");
          }
        }
      );
    }
  }
}