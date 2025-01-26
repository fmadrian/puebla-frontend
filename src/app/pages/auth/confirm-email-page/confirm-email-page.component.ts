import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, interval, of, Subscription, take, throwError, timer } from 'rxjs';
import { AuthService } from '../../../services/auth/auth.service';
import { ToastService } from '../../../services/toast/toast.service';
import { APP_HYPERLINKS } from '../../../../consts/AppRoutes';
import { ToastModule } from 'primeng/toast';
import { MessageboxComponent } from '../../../components/shared/messagebox/messagebox.component';
import { LoadingComponent } from "../../../components/shared/loading/loading.component";

@Component({
  selector: 'app-confirm-email-page',
  imports: [
    ToastModule,
    MessageboxComponent,
    LoadingComponent,
],
  templateUrl: './confirm-email-page.component.html',
  styleUrl: './confirm-email-page.component.css'
})
export class ConfirmEmailPageComponent implements OnInit {
  
  // Flag to show loading spinner.
  isLoading = true;
  // Delay in seconds before redirecting to login page.
  remainingSeconds = 5;
  // Message returned by API and shown to user.
  message = '';
  type : 'error' | 'info' = 'info';
  // Code from URL.
  code = '';
  // Subscription to get code from URL.
  params$: Subscription | null = null;

  constructor(private activatedRoute: ActivatedRoute, private authService : AuthService, private toastService: ToastService, private router: Router) {}

  ngOnInit() {
     // Get subscription and code.
     this.params$ = this.activatedRoute.paramMap.subscribe(
      (p) => this.code = p.get('code') ?? ''
    );
    this.activate();
  }

  activate(){
    
    this.isLoading = true;
    this.type = 'info';
      // Call API to confirm email.
      this.authService.confirmEmail(this.code)
      .pipe(
        finalize(()=> this.isLoading = false)
      ).subscribe(
        {
          next: (response)=>{
            this.message = response.message ?? '';
            if(response.result){
              // Show success message and redirect after N seconds.
              this.toastService.success("Email confirmed successfully.");
              interval(1000).pipe(
                finalize(()=> this.router.navigateByUrl(APP_HYPERLINKS.auth.login)),
                take(this.remainingSeconds)
              )
              .subscribe((res)=>{
                this.remainingSeconds -= 1;
              });
            }else{
              throwError(()=>response.message);
            }
          },error: (error)=>{
            this.type = 'error';
            // Show error message.
            this.toastService.error("Error while confirming email.");
            this.message = error;
          }
        }
      );
    };
}
