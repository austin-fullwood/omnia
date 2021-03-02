import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(public snackBar: MatSnackBar) { }

  public showNotif(message: string, action = 'error', duration = 2000): void {
    this.snackBar.open(message, action, { duration }).onAction().subscribe(() => {
      console.log('Notification displayed.');
    });
  }
}
