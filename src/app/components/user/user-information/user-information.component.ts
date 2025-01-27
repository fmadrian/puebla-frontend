import { Component, Input } from '@angular/core';
import { User } from '../../../types/user.type';

@Component({
  selector: 'app-user-information',
  imports: [],
  templateUrl: './user-information.component.html',
  styleUrl: './user-information.component.css'
})
export class UserInformationComponent {
  @Input() user: User | undefined;
  @Input() showTitle = true;
}
