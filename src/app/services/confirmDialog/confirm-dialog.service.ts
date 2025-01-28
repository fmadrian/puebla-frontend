import { Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  constructor(private confirmationService: ConfirmationService) { }

  showDialog(event: Event, message: string, header: string, accept: Function, reject?: Function) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message,
      header,
      // Button style class.
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      // Icons.
      icon: 'pi pi-info-circle',
      acceptIcon: "none",
      rejectIcon: "none",
      // Callback functions.
      accept,
      reject
    });
  }
}
