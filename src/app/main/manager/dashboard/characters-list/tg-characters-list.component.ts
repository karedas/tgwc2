import { Component, ViewEncapsulation, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ethnicity } from 'src/assets/data/ethnicity/ethnicity.const';
import { UserService } from 'src/app/core/services/user.service';
import { Subject } from 'rxjs';
import { takeUntil, delay } from 'rxjs/operators';
import { Character } from 'src/app/core/models/character.model';
import { LoginClientService } from 'src/app/main/client/services/login-client.service';
import { Router } from '@angular/router';
import { MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { AlertComponent } from 'src/app/main/common/components/dialogs/alert/alert.component';
import { tgAnimations } from 'src/app/animations';


@Component({
  selector: 'tg-characters-list',
  templateUrl: './tg-characters-list.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: [tgAnimations],
})
export class MyCharactersComponent implements OnInit, OnDestroy {

  @Output() goToManage = new EventEmitter();
  readonly env = environment;
  readonly ethnicity = ethnicity;
  readonly maxCharacter: number;
  readonly displayedColumns: string[] = ['image', 'name', 'actions', 'expand'];
  expandedElement: [];

  charactersList: Character[];
  enabledCharactersNumber: number;
  replayMessage: string;

  private dialogRef: MatDialogRef<AlertComponent>;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private userService: UserService,
    private loginClientService: LoginClientService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.replayMessage = this.loginClientService.replayMessage;
    this._unsubscribeAll = new Subject<any>();
  }

  ngOnInit() {

    this.loginClientService.replayMessage
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((msg: string) => {
        this.updateReplayMessage(msg);
      });

    this.userService.getCharacters().subscribe((result: Character[]) => {
      this.charactersList = result.sort(function(a,b) {
        if (a.is_default == true && !b.is_default) {
          return -1;
        } else return 1;
      });
    });
  }

  private updateReplayMessage(msg: string) {
    const replayDialog = this.dialog.getDialogById('loginReplay');
    if (replayDialog) {
      replayDialog.componentInstance.data = {
        replayMessage: msg
      };
    }
  }

  loginCharacter(name: string, secret: string, event: Event) {
    event.stopImmediatePropagation();
    const values = { name: name, secret: secret };

    this.openLoginDialog();
    this.loginClientService.login(values)
      .pipe(
        delay(1000),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe((res) => {
        if (res === true) {
          this.redirectToClient();
          return;
        }

        // this.dialogRef.componentInstance.data = {
        //   hasError: false
        // };
      });
  }

  redirectToClient() {
    this.router.navigate(['/webclient'])
      .then(() => {
        this.closeLoginDialog();
        this.loginClientService.replayMessage = '';
      });
  }

  private openLoginDialog() {
    const config = new MatDialogConfig;
    config.id = 'loginReplay';
    config.width = '350px';
    this.dialogRef = this.dialog.open(AlertComponent, config);
  }

  private closeLoginDialog() {
    this.dialogRef.close();
  }



  // private getTotalEnabledChars(chars: any): number {

  //   if (!chars)
  //     return;

  //   let count = 0;

  //   for (let i = 0; i < chars.length; ++i) {
  //     if (chars[i].status === 1)
  //       count++;
  //   }

  //   return count;
  // }

  goToChractersManage(event) {
    this.goToManage.emit();
  }


  /* Character Actions */
  onDisableChar(pgname: string): void {
    pgname = pgname.toUpperCase();
    const confirm = prompt(`Attenzione, l\'operazione non potrà essere annullata.
      Se sei certo di questa scelta digita qui sotto "${pgname}" e premi Ok`, ``);

    if (confirm != null && confirm === pgname) {
      // DISABLE Character!!
    }
  }

  onSelectedPrimary(char) {
    this.userService.setDefaultCharacter(char).subscribe();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
