import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

@Component({
  selector: 'app-messagebox',
  imports: [],
  templateUrl: './messagebox.component.html',
  styleUrl: './messagebox.component.css'
})
export class MessageboxComponent implements OnChanges {
  @Input() errors: string[] = [];
  @Input() showTitle = true;
  @Input() showDate = true;
  date = this.calculateDate();

  ngOnChanges(changes: SimpleChanges): void {
    this.date = this.calculateDate();
  }

  private calculateDate() {
    return format(new Date(Date.now()), 'dd/MM/y	hh:mm:ss aa', { locale: zhCN });
  }
}