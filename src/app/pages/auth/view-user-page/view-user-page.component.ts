// Angular.
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { finalize, Subscription, throwError } from 'rxjs';
// Constants and types.
import { User } from '../../../types/user.type';
import { APP_HYPERLINKS } from '../../../consts/AppRoutes';
// Services.
import { AuthService } from '../../../services/auth/auth.service';
// Components.
import { LoadingComponent } from '../../../components/shared/loading/loading.component';
import { MessageboxComponent } from '../../../components/shared/messagebox/messagebox.component';
import { UserInformationComponent } from '../../../components/user/user-information/user-information.component';
// PrimeNG.
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ConfirmDialogService } from '../../../services/confirmDialog/confirm-dialog.service';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastService } from '../../../services/toast/toast.service';


@Component({
  selector: 'app-view-user-page',
  imports: [
    // Angular.
    RouterModule,
    // PrimeNG.
    ButtonModule,
    RippleModule,
    ToastModule,
    ConfirmDialogModule,
    // Components
    LoadingComponent,
    MessageboxComponent,
    UserInformationComponent,
  ],
  templateUrl: './view-user-page.component.html',
  styleUrl: './view-user-page.component.css'
})
export class ViewUserPageComponent {
  APP_HYPERLINKS = APP_HYPERLINKS;

  isLoading = false;
  errors = [];

  id = "";
  params$: Subscription | null = null;

  user = new User();

  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute, private router: Router,
    private confirmDialogService: ConfirmDialogService, private toastService: ToastService) { }

  ngOnInit(): void {
    // Get subscription and search.
    this.params$ = this.activatedRoute.paramMap.subscribe(
      (p) => this.id = p.get('id') ?? ''
    );
    this.get();
  }
  ngOnDestroy(): void {
    // Dispose subscription.
    if (this.params$ !== null)
      this.params$.unsubscribe();
  }

  get() {
    this.isLoading = true;
    this.authService.getUser(this.id).pipe(
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
            role: response.object.roles.toString(),
            isEnabled: response.object.isEnabled
          };
        } else if (response.errors.length > 0)
          throwError(() => response.errors);
        else
          throwError(() => ['{ERROBJ] - Unknown error.']);
      }, error: (error) => {
        this.errors = error;
      }
    })
  }

  update() {
    // Navigate to object's page.
    this.router.navigateByUrl(APP_HYPERLINKS.auth.update(this.id));
  }

  toggle(event: Event) {
    let action = this.user.isEnabled ? 'Deactivate' : 'Activate';
    this.confirmDialogService.showDialog(
      event, `Do you want to ${action.toLocaleLowerCase()} '${this.user!.username}'?`, `${action} user`, () => {
        this.authService.toggle(this.id).pipe(
          finalize(() => {
            this.isLoading = false;
          })
        ).subscribe(
          {
            next: (response) => {
              if (response.result) {
                this.get();
                this.toastService.success(`User ${this.user.isEnabled ? 'activated' : 'deactivated'}.`);
              }
              else if (response.errors.length > 0)
                throwError(() => response.errors);
              else
                throwError(() => ['[ERROBJ] - Unknown error.']);
            },
            error: (error) => {
              this.errors = error;
            }
          }
        )
      }
    )
  }
  deleteUser(event: Event) {
    this.confirmDialogService.showDialog(
      event, `Do you want to delete this user '${this.user!.username}'?`, `Delete user`, () => {
        this.authService.deleteUser(this.id).pipe(
          finalize(() => {
            this.isLoading = false;
          })
        ).subscribe(
          {
            next: (response) => {
              if (response.result) {
                this.toastService.success(`User was deleted.`);
                this.router.navigateByUrl(APP_HYPERLINKS.auth.search);
              }
              else if (response.errors.length > 0)
                throwError(() => response.errors);
              else
                throwError(() => ['[ERROBJ] - Unknown error.']);
            },
            error: (error) => {
              this.errors = error;
            }
          }
        )
      }
    );
  }
}
