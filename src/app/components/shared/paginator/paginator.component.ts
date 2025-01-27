import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// Types.
import { Pagination } from '../../../types/pagination.type';
// PrimeNG.
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { PAGE_SIZE_OPTIONS } from '../../../../consts/SearchOptions';

@Component({
  selector: 'app-paginator',
  imports: [
    // Angular 
    ReactiveFormsModule,
    // PrimeNG
    DropdownModule,
    ButtonModule,
    RippleModule,

  ],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css'
})
export class PaginatorComponent implements OnChanges {
  pageSizeOptions = PAGE_SIZE_OPTIONS;
  @Input() pagination = new Pagination(1, this.pageSizeOptions[0]);
  /**
   * Total amount of pages in query.
   */
  @Input() pageCount = 0;
  /**
   * Total amount of results returned by query.
   */
  @Input() totalCount = 0;

  @Output() outputPage = new EventEmitter<number>();
  @Output() outputPageSize = new EventEmitter<number>();
  @Output() outputPagination = new EventEmitter<Pagination>();

  form = new FormGroup({
    pageSize: new FormControl(this.pagination.pageSize, [Validators.required])
  })

  ngOnChanges(changes: SimpleChanges): void {
    this.form.patchValue({
      pageSize: this.pageSizeOptions.find(size => size === this.pagination.pageSize)
    })
  }

  goto(page: number) {
    this.outputPagination.emit({
      page,
      pageSize: this.pagination.pageSize
    })
  }
  changePageSize() {
    this.outputPagination.emit({
      page: 1,
      pageSize: this.form.get('pageSize')?.value ?? PAGE_SIZE_OPTIONS[0]
    })
  }

}
