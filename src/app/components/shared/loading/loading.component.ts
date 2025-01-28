import { Component, Input } from '@angular/core';
// PrimeNG.
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-loading',
  imports: [
    // PrimeNG.
    SkeletonModule,
    ProgressSpinnerModule
  ],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css'
})
export class LoadingComponent {

  @Input() text = '';
  @Input() strokeWidth = 4;

}