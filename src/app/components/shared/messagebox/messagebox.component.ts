import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { format } from 'date-fns';

@Component({
  selector: 'app-messagebox',
  imports: [],
  templateUrl: './messagebox.component.html',
  styleUrl: './messagebox.component.css'
})
export class MessageboxComponent implements OnChanges {
  @Input() type : 'error' | 'success' | 'info' | 'warning' = 'error';
  @Input() messages: string[] = [];
  @Input() showTitle = true;
  @Input() showDate = true;
  @Input() showBulletPoints = true;
  date = this.calculateDate();

  ngOnChanges(changes: SimpleChanges): void {
    this.date = this.calculateDate();
  }

  private calculateDate() {
    return format(new Date(Date.now()), 'dd/MM/y	hh:mm:ss aa');
  }
}