import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
// Payloads
import { SearchUserRequest } from '../../../dtos/requests/user/search.user.request';
import { Pagination } from '../../../types/pagination.type';
// PrimeNG.
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { InputSwitchModule } from 'primeng/inputswitch';

@Component({
  selector: 'app-user-search-form',
  imports: [
    // Angular
    ReactiveFormsModule,
    // PrimeNG 
    InputTextModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    InputSwitchModule
  ],
  templateUrl: './user-search-form.component.html',
  styleUrl: './user-search-form.component.css'
})
export class UserSearchFormComponent implements OnChanges {
  @Input() q = "";
  @Input() isEnabled = true;
  /**  
   * Pagination settings.
  */
  @Input() pagination = new Pagination();
  /**
   * Search form values to be sent back to parent component.
   */
  @Output() output = new EventEmitter<SearchUserRequest>();
  /**
   * Form.
   */
  form = new FormGroup({
    q: new FormControl(this.q),
    isEnabled: new FormControl(this.isEnabled)
  });

  ngOnChanges(changes: SimpleChanges): void {
    this.form.patchValue({
      q: this.q,
      isEnabled: this.isEnabled
    })
  }

  submit() {
    this.output.emit({
      ...this.pagination,
      q: this.form.get('q')?.value ?? '',
      isEnabled: this.form.get('isEnabled')?.value ?? false
    });
  }
}
