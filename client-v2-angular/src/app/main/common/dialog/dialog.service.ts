import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CookieLawComponent } from '../../client/windows/cookie-law/cookie-law.component';
import { Observable } from 'rxjs';
import { WelcomeNewsComponent } from '../../client/windows/welcome-news/welcome-news.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(public dialog: MatDialog) { }

  /** Cookie Law  */
  openCookieModal(): Observable<any> {
    const dialogRef = this.dialog.open(CookieLawComponent, {
      width: '450px',
      disableClose: true,
      autoFocus: true,
      panelClass: 'tg-dialog'
    });

    return dialogRef.afterClosed();
  }

  /** Welcome News */
  openWelcomeNews() {

    if (!localStorage.getItem('welcomenews')) {
      const dialogRef = this.dialog.open(WelcomeNewsComponent, {
        width: 'auto',
        disableClose: true,
        maxWidth: '700px'
      });
    }
  }

}
