import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Used to notify the user of events.
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(public snackBar: MatSnackBar) { }

  /**
   * Notifys the user with a snack bar at the bottom of the screen.
   * @param message   text to be displayed in the snack bar.
   * @param action    action for the notification.
   * @param duration  time the snack bar is shown for.
   */
  public showNotif(message: string, action = 'error', duration = 2000): void {
    this.snackBar.open(message, action, { duration }).onAction().subscribe(() => {
      console.log('Notification displayed.');
    });
  }
}
