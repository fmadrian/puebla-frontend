// Angular and RxJS
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, throwError } from 'rxjs';
// Components.
import { UserFormComponent } from "../../../components/user/user-form/user-form.component";
import { MessageboxComponent } from '../../../components/shared/messagebox/messagebox.component';
// Services.
import { AuthService } from '../../../services/auth/auth.service';
// PrimeNG
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { APP_HYPERLINKS, APP_ROUTES } from '../../../../consts/AppRoutes';
import { LoadingComponent } from '../../../components/shared/loading/loading.component';
import { ToastService } from '../../../services/toast/toast.service';
import { ConfirmDialogService } from '../../../services/confirmDialog/confirm-dialog.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { User } from '../../../types/user.type';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [
    // Components.
    UserFormComponent,
    MessageboxComponent,
    LoadingComponent,
    // PrimeNG.
    RippleModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [],
  templateUrl: './signup-page.component.html',
  styleUrl: './signup-page.component.css'
})
export class SignupPageComponent {
  // Flags.
  isSaving = false;

  user = new User();
  errors = [];

  constructor(private authService: AuthService, private router: Router, private toastService: ToastService, private confirmDialogService: ConfirmDialogService) { }

  /**
   * Receive output from child component.
   * @param user User object to be received.
   */
  receiveOutput(user: User) {
    this.user = user;
    this.isSaving = true;
    this.errors = [];
    // Signup.
    this.authService.signup(user).pipe(
      finalize(() => {
        this.isSaving = false;
      })
    )
      .subscribe({
        next: (response) => {
          if (response.result) {
            // Display message.
            this.toastService.success(response.message!);
            this.router.navigateByUrl(APP_HYPERLINKS.main.home);
            // Redirect to update page.
            // this.router.navigateByUrl(APP_HYPERLINKS.auth.update(response.object.id));
          } else {
            if (response.errors.length > 0)
              throwError(() => response.errors)
            else
              throwError(() => ["[PAGE] - Unknown error."])
          }
        },
        error: (error) => {
          this.errors = error;
          this.toastService.error('User was not created.');
        }
      });
  }
}
