import { Component } from '@angular/core';
import { APP_HYPERLINKS } from '../../../consts/AppRoutes';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  imports: [
    RouterModule
  ],
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.css'
})
export class NotFoundPageComponent {
  APP_HYPERLINKS = APP_HYPERLINKS;

}
