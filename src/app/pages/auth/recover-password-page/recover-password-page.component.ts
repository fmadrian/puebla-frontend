// Environment variables.
import { environment } from "../../../../environments/environment.development"
// Angular.
import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { finalize, throwError } from 'rxjs';
// PrimeNG.
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
// Constants.
import { APP_ROUTES } from '../../../consts/AppRoutes';
// Components
import { LoadingComponent } from '../../../components/shared/loading/loading.component';
import { ToastService } from "../../../services/toast/toast.service";
import { MessageboxComponent } from "../../../components/shared/messagebox/messagebox.component";

@Component({
  selector: 'app-recover-password-page',
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
  ],
  templateUrl: './recover-password-page.component.html',
  styleUrl: './recover-password-page.component.css'
})
export class RecoverPasswordPageComponent implements OnDestroy {

  // Flags.
  isLoading = false;
  isSuccessful = false;
  wasRecoverySuccessful = false;
  // Constants.
  APP_ROUTES = APP_ROUTES;
  RECOVERY_PASSWORD_EMAIL_ADDRESS = environment.RECOVERY_PASSWORD_EMAIL_ADDRESS;
  // Form.
  form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
  })
  /**
   * Errors to be shown to the user.
   * Reseted each time the user modifies values in the form to avoid
   * showing an error message while the user is typing.
   */
  errors: string[] = [];
  // Messages.
  successMessage = '';
  // Subscriptions.
  formValuesChanged$ = this.form.valueChanges.subscribe(
    () => this.errors = []
  );

  constructor(private authService: AuthService, private router: Router, private toastService: ToastService) { }
  ngOnDestroy(): void {
    // Unsubscribe from observables.
    this.formValuesChanged$.unsubscribe();
  }

  recoverPassword() {
    if (this.form.valid) {
      this.isLoading = true;
      this.successMessage = '';
      this.errors = [];
      this.authService.recoverPassword({
        username: this.form.get('username')?.value ?? '',
        email: this.form.get('email')?.value ?? '',
      }).pipe(
        finalize(() => {
          this.isLoading = false;
        })
      ).subscribe(
        {
          next: (response) => {
            // If recover password is successful, display the message.
            if (response.result) {
              this.isSuccessful = true;
              this.successMessage = response.message!;
              this.toastService.success(response.message!);
              this.wasRecoverySuccessful = true;
            } else if (response.errors.length > 0) {
              // Display all errors.
              throwError(() => response.errors);
            }
            else {
              // Result false, probably an unknown error.
              throwError(() => ['[PAGE] - Unknown error.']);
            }
          },
          error: (error) => {
            this.errors = error;
            this.toastService.error('Password could not be recovered. Please, try again');
          }
        }
      );
    }else{
      this.errors = ['Please, fill all the fields in the form.'];
    }
  }
}

