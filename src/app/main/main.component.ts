import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CookieLawComponent } from './common/components/dialogs/cookie-law/cookie-law.component';
import { Router } from '@angular/router';


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
    private router: Router,
    private cookieService: CookieService,
    public dialog: MatDialog,
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    if (this.cookieService.check('tgCookieLaw')) {
      this.start();
    } else {
      this.openCookieLaw();
    }
  }

  private openCookieLaw() {
    const dialogID = 'cookielaw';
    const config = new MatDialogConfig();
    config.id = dialogID;
    config.disableClose = true;
    config.autoFocus = false;
    config.width = '450px';
    config.height = '350px';

    const dialogRef = this.dialog.open(CookieLawComponent, config);

    dialogRef.afterClosed().subscribe(() => this.start());
  }

  private start() {
    this.isCookieAccepted = true;
    this.router.navigate(['/auth/login-character'])
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
