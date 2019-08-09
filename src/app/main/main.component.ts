import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { CookieLawComponent } from './common/components/dialogs/cookie-law/cookie-law.component';

@Component({
  selector: 'tg-main',
  templateUrl: './main.component.html',
  styles: [`
    :host {
      height: 100%;
    }
  `]
})
export class MainComponent implements OnInit, OnDestroy {

  public preloaded = false;
  public isCookieAccepted = false;
  private _unsubscribeAll = new Subject();

  constructor(
    private cookieService: CookieService,
    public dialog: MatDialog,
  ) {

    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

    if (!this.cookieService.check('tgCookieLaw')) {
      this.openCookieLaw().afterClosed()
        .subscribe(() => {
          this.start();
        });
    } else {
      this.start();
    }
  }


  openCookieLaw(): MatDialogRef<CookieLawComponent, MatDialogConfig> {
    const dialogID = 'cookielaw';
    const config = new MatDialogConfig();
    config.id = dialogID;
    config.disableClose = true;
    config.autoFocus = false;
    config.width = '450px';
    config.height = '250px';
    const dialogRef = this.dialog.open(CookieLawComponent, config);
    return dialogRef;

  }

   onCookieAccepted(status: boolean) {
    this.isCookieAccepted = status;
  }

  start() {
    this.isCookieAccepted = true;
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
