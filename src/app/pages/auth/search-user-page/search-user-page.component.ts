// Angular.
import { Component } from '@angular/core';
import { finalize, throwError } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// Components.
import { UserSearchFormComponent } from '../../../components/user/user-search-form/user-search-form.component';
import { UserTableComponent } from "../../../components/user/user-table/user-table.component"
import { MessageboxComponent } from '../../../components/shared/messagebox/messagebox.component';
// Services.
import { AuthService } from '../../../services/auth/auth.service';
// DTOs.
import { SearchUserRequest } from '../../../dtos/requests/user/search.user.request';
import { UserResponse } from '../../../dtos/responses/user/user.response';
import { Pagination } from '../../../types/pagination.type';
// Constants.
import { PAGE_SIZE_OPTIONS } from '../../../consts/SearchOptions';
import { LoadingComponent } from '../../../components/shared/loading/loading.component';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { APP_HYPERLINKS } from '../../../consts/AppRoutes';


@Component({
  selector: 'app-search-user-page',
  imports: [
    // Angular.
    RouterModule,
    // Components.
    UserSearchFormComponent,
    UserTableComponent,
    LoadingComponent,
    MessageboxComponent,
    // PrimeNG.
    ButtonModule,
    RippleModule
  ],
  templateUrl: './search-user-page.component.html',
  styleUrl: './search-user-page.component.css'
})
export class SearchUserPageComponent {
  APP_HYPERLINKS = APP_HYPERLINKS;

  users: UserResponse[] = [];
  pagination = new Pagination(1, PAGE_SIZE_OPTIONS[0]);
  pageCount = 0;
  totalCount = 0;

  errors = [];

  lastRequest: SearchUserRequest = {
    q: '',
    ...this.pagination,
    isEnabled: true
  };

  isLoading = false;

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) { }
  ngOnInit(): void {
    // Get request (to page) parameters and preload the component with this values.
    this.route.queryParamMap.subscribe(p => {
      // If it is not possible to convert numeric values, use default ones.
      const page = Number.parseInt(p.get('page') ?? ''), pageSize = Number.parseInt(p.get('pageSize') ?? '');
      this.lastRequest.q = p.get('q') ?? this.lastRequest.q;
      this.lastRequest.page = isNaN(page) ? this.pagination.page : page;
      this.lastRequest.pageSize = isNaN(pageSize) ? PAGE_SIZE_OPTIONS[0] : pageSize;
      // Set in 'true' for non boolean value.
      this.lastRequest.isEnabled = !(p.get('isEnabled') === 'false')
    });
    this.search();
  }

  search() {
    // If there is a previous last search/request run it again.
    if (this.lastRequest) {
      // Clean results and errors.
      this.users = [];
      this.errors = [];
      // Change the new parameters on the URL.
      this.storeRequestParams();
      this.isLoading = true;
      this.authService.getUsers(this.lastRequest)
        .pipe(
          finalize(() => {
            this.isLoading = false;
          })
        ).subscribe
        ({
          next: (response) => {
            if (response.result) {
              this.users = response.object.items;
              this.pagination.page = response.object.page;
              this.totalCount = response.object.totalCount;
              this.pageCount = Math.ceil(this.totalCount / this.pagination.pageSize);
            }
            else if (response.errors.length > 0)
              throwError(() => response.errors)
            else
              throwError(() => ['[ERROBJ]-Unknown error.']);

          }, error: (error) => {
            this.errors = error;
          },

        });
    }
  }

  handleSearchFormOutput(request: SearchUserRequest) {
    // Store last request and do the search.
    this.lastRequest = request;
    this.search();
  }
  handlePaginationOutput(pagination: Pagination) {
    // Change pagination parameters and repeat last search.
    this.pagination = pagination;
    if (this.lastRequest) {
      this.lastRequest.page = pagination.page;
      this.lastRequest.pageSize = pagination.pageSize;
    }
    this.search();
  }

  handleElementSelectedOutput(event: any) {
    // Navigate to object's page.
    this.router.navigateByUrl(APP_HYPERLINKS.auth.user(event.data.id));
  }

  private storeRequestParams() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: this.lastRequest.q,
        page: this.lastRequest.page,
        pageSize: this.lastRequest.pageSize,
        isEnabled: this.lastRequest.isEnabled,
      },
      queryParamsHandling: 'merge'
    }
    )
  }
}
