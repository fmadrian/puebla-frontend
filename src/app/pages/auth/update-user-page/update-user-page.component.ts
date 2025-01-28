import { Component, OnDestroy, OnInit } from '@angular/core';
import { finalize, Subscription, throwError } from 'rxjs';
import { AuthService } from '../../../services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../services/toast/toast.service';
import { User } from '../../../types/user.type';
import { MessageboxComponent } from "../../../components/shared/messagebox/messagebox.component";
import { UserFormComponent } from "../../../components/user/user-form/user-form.component";
import { LoadingComponent } from "../../../components/shared/loading/loading.component";
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-update-user-page',
  imports: [MessageboxComponent, UserFormComponent, LoadingComponent, ToastModule],
  templateUrl: './update-user-page.component.html',
  styleUrl: './update-user-page.component.css'
})
export class UpdateUserPageComponent implements OnInit, OnDestroy {

  isLoading = false;
  isSaving = false;
  isLoadingError = false;
  isUpdateAny = false;

  errors: [] = [];
  /**
   * ID of the user to be updated. 
   * */
  id = "";
  params$: Subscription | null = null;
  /**
   * User object that represents information retrieved from API.
   */
  user = new User();

  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute, private toastService: ToastService) { }

  ngOnInit(): void {
    // Get subscription and search.
    this.params$ = this.activatedRoute.paramMap.subscribe(
      (p) => this.id = p.get('id') ?? ''
    );

    if (this.id.trim() !== '')
      this.isUpdateAny = true;
    this.get();
  }
  ngOnDestroy(): void {
    // Dispose subscription.
    if (this.params$ !== null)
      this.params$.unsubscribe();
  }

  get() {
    this.isLoading = true;
    this.errors = [];
    // If we are not updating another user, we should retrieve the currently logged in user's information. 
    const request = this.isUpdateAny ? this.authService.getUser(this.id) : this.authService.getCurrentUser();
    request.pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (response) => {
        if (response.result) {
          this.user = {
            firstName: response.object.firstName,
            lastName: response.object.lastName,
            email: response.object.email,
            // nationalId: response.object.nationalId,
            username: response.object.userName,
            password: "",
            role: response.object.roles.toString()
          };
        } else if (response.errors.length > 0)
          throwError(() => response.errors);
        else
          throwError(() => ['[ERR] - Unknown error.']);
      }, error: (error) => {
        this.errors = error;
        this.isLoadingError = true;
      }
    })
  }

  receiveOutput(user: User) {
    this.isSaving = true;
    let request = null;
    this.errors = [];

    // Update or update any.
    if (this.isUpdateAny)
      request = this.authService.updateAny(this.id, user)
        .pipe(finalize(() => this.isSaving = false));
    else
      // Include the user's current password. 
      request = this.authService.update({ ...user, currentPassword: user.currentPassword ?? '' })
        .pipe(finalize(() => this.isSaving = false));

    // Make request.
    request.subscribe({
      next: (response) => {
        if (response.result) {
          // Display message.
          this.toastService.success('Updated user.');
        } else {
          if (response.errors.length > 0)
            throwError(() => response.errors)
          else
            throwError(() => ["[ERR] - Unknown error."])
        }
      },
      error: (error) => {
        this.errors = error;
        this.toastService.error('Could not update the user.');
      }
    });
  }
}
