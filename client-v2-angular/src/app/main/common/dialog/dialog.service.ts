import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CookieLawComponent } from '../../client/windows/cookie-law/cookie-law.component';
import { Observable } from 'rxjs';
import { WelcomeNewsComponent } from '../../client/windows/welcome-news/welcome-news.component';
import { NoFeatureComponent } from '../../client/windows/no-feature/no-feature.component';
import { EditorComponent } from '../../client/windows/editor/editor.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(public dialog: MatDialog) { }

  /** Cookie Law  */
  openCookieModal(): Observable<any> {
    const dialogRef = this.dialog.open(CookieLawComponent, {
      panelClass: 'tg-dialog',
      width: '450px',
      disableClose: true,
      autoFocus: true
    });

    return dialogRef.afterClosed();
  }

  /** Welcome News */
  openWelcomeNews() {

    if (!localStorage.getItem('welcomenews')) {
      this.dialog.open(WelcomeNewsComponent, {
        panelClass: 'tg-dialog',
        width: 'auto',
        disableClose: true,
        maxWidth: '700px'
      });
    }
  }

  /** Generic Editor */
  openEditor(data) {
    console.log(data);
    this.dialog.open(EditorComponent, {
      data: data,
      panelClass: 'tg-dialog',
      width: '450px',
    });
  }

  openNoFeature() {
    this.dialog.open(NoFeatureComponent, {
      panelClass: 'tg-dialog', 
      width: 'auto',
    })
  }

}
