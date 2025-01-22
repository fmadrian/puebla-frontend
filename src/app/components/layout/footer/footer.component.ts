import { Component } from '@angular/core';
import { environment } from "../../../../environments/environment";

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  
  today = new Date(Date.now()).toISOString();
  version = environment.WEBAPP_VERSION;
}
