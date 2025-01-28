// Angular.
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
// Payload.
import { UserResponse } from '../../../dtos/responses/user/user.response'
import { Pagination } from '../../../types/pagination.type';
// Constants.
import { APP_HYPERLINKS } from '../../../consts/AppRoutes';
// PrimeNG.
import { TableModule } from 'primeng/table';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
// Component.
import { PaginatorComponent } from '../../shared/paginator/paginator.component';

@Component({
  selector: 'app-user-table',
  imports: [
    // PrimeNG.
    TableModule,
    RippleModule,
    ButtonModule,
    SkeletonModule,
    // Components.
    PaginatorComponent
  ],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.css'
})
export class UserTableComponent {
  @Input() pagination = new Pagination(1, 0);
  @Input() pageCount = 0;
  @Input() totalCount = 0;
  @Input() users: UserResponse[] = [];
  // Output to be processed when the pagination changes.
  @Output() outputPagination = new EventEmitter<Pagination>();
  // Output to be processed when an element in the table is selected.
  @Output() outputElementSelected = new EventEmitter();

  constructor(private router: Router) { }

  /**
   * Receive new pagination data from paginator and pass it to the page (parent), so it can execute a new query.
   * @param pagination Pagination object from child component
   */
  changePagination(pagination: Pagination) {
    // Pass to parent component.
    this.outputPagination.emit(pagination);
  }
  onRowSelect(event: any) {
    // Navigate to object's page.
    this.outputElementSelected.emit(event);
  }
}
