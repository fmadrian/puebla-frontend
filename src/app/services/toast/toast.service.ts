import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private messageService: MessageService) { }

  show(detail: string, summary = "", severity: 'error' | 'success' | 'secondary' | 'primary' = 'primary', key = "toast") {
    this.messageService.clear();
    this.messageService.add({
      key,
      severity,
      summary,
      detail
    });
  }

  success(detail: string, summary = "OK", key = "toast") {
    this.show(detail, summary, 'success', key);
  }
  error(detail: string, summary = "Error", key = "toast") {
    this.show(detail, summary, 'error', key);
  }
}
