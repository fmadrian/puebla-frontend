import { Component, EventEmitter, input, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
// App types.
import { User } from '../../../types/user.type';
import { Role } from '../../../types/role.type';
// PrimeNG.
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DropdownModule } from 'primeng/dropdown';
import { SignupRequest } from '../../../dtos/requests/auth/signup/signup.request';
import { UpdateAnyUserRequest } from '../../../dtos/requests/auth/update/update-any.request';
import { UpdateUserRequest } from '../../../dtos/requests/auth/update/update.request';


@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    // Angular
    ReactiveFormsModule,
    // PrimeNG 
    InputTextModule,
    PasswordModule,
    ButtonModule,
    RippleModule,
    DropdownModule
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit, OnChanges, OnDestroy {
  roles: Role[] = [
    { name: 'Super usuario', value: 'admin' },
    { name: 'Administrador', value: 'manager' },
    { name: 'Usuario', value: 'user' }
  ];
  /**  
   * Object we receive from parent component.
  */
  @Input() input: User = new User();
  @Input() isUpdateAny = false;
  @Input() isSignup = false
  /**
   * Signal/object we send back to parent component.
   */
  @Output() output = new EventEmitter<User>();

  passwordVerification$: Subscription | null = null;
  constructor() { }

  ngOnInit(): void {
    if (!this.isUpdateAny && !this.isSignup) {
      // Add current password, when we are updating the current user.
      this.userForm.addControl('currentPassword', new FormControl("", [Validators.required]));
    }
    // Add password and current password validation.
    this.passwordVerification$ = this.userForm.valueChanges.subscribe(
      () => {
        // Check if the passwords are equals and put an error on the second password field
        // if they aren't.
        const { password, password2 } = this.userForm.controls;
        if (!password2.dirty)
          password2.markAsDirty();

        if (password.value !== password2.value)
          password2.setErrors({});
        else
          password2.setErrors(null); // Clears errors.
      }
    )
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.reset();
  }
  ngOnDestroy(): void {
    if (this.passwordVerification$)
      this.passwordVerification$.unsubscribe();
  }

  /**
   * User form.
   */
  userForm = new UntypedFormGroup({
    username: new FormControl(this.input.username, [Validators.required]),
    password: new FormControl(this.input.password, [Validators.required, Validators.min(6)]),
    password2: new FormControl('', [Validators.required]),
    email: new FormControl(this.input.email, [Validators.required, Validators.email]),
    role: new FormControl(this.input.role, [Validators.required]),
    firstName: new FormControl(this.input.firstName, [Validators.required]),
    lastName: new FormControl(this.input.lastName, [Validators.required]),
    //nationalId: new FormControl(this.input.nationalId, [Validators.required]),
  });
  /**
   * Resets form to clean values or values provided as input.
   */
  reset() {
    // Use the original values provided by parent component (input) or clean the field.
    this.userForm.patchValue({
      username: this.input.username,
      password: this.input.password,
      password2: '',
      email: this.input.email,
      role: this.input.role,
      firstName: this.input.firstName,
      lastName: this.input.lastName,
      //nationalId: this.input.nationalId
    });
    this.userForm.markAsPristine();
  }
  /**
   * Checks if the form is valid and emits it to the parent component.
   */
  submit() {
    if (this.userForm.valid) {
      let user: User = {
        firstName: this.userForm.get('firstName')?.value ?? '',
        lastName: this.userForm.get('lastName')?.value ?? '',
        email: this.userForm.get('email')?.value ?? '',
        //nationalId: this.userForm.get('nationalId')?.value ?? '',
        password: this.userForm.get('password')?.value ?? '',
        role: this.userForm.get('role')?.value ?? '',
        username: this.userForm.get('username')?.value ?? ''
      };
      // Add current password, when updating own user.
      if (!this.isUpdateAny && !this.isSignup)
        user = {
          ...user,
          currentPassword: this.userForm.get('currentPassword')?.value ?? ''
        }
      this.output.emit(user);
    }
  }
}
