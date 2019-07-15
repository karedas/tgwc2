import { Component, ViewEncapsulation, Output, EventEmitter, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ethnicity } from 'src/assets/data/ethnicity/ethnicity.const';
import { UserService } from 'src/app/core/services/user.service';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil, delay } from 'rxjs/operators';
import { Character } from 'src/app/core/models/character.model';
import { LoginClientService } from 'src/app/main/client/services/login-client.service';
import { Router } from '@angular/router';
import { MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { AlertComponent } from 'src/app/main/common/components/dialogs/alert/alert.component';


@Component({
  selector: 'tg-characters-list',
  templateUrl: './tg-characters-list.component.html',
  encapsulation: ViewEncapsulation.None
})
export class MyCharactersComponent implements OnInit {

  @Output() goToManage = new EventEmitter();
  // @Input() chars: any[];

  readonly env = environment;
  readonly ethnicity = ethnicity;
  readonly maxCharacter: number;

  charactersList: Observable<any>;
  enabledCharactersNumber: number;
  replayMessage: string;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private userService: UserService,
    private loginClientService: LoginClientService,
    private router: Router,
    public dialog: MatDialog,
  ) {
    this._unsubscribeAll = new Subject<any>();
    this.replayMessage = this.loginClientService.replayMessage;
  }

  ngOnInit() {

    this.loginClientService.replayMessage
      .pipe( takeUntil(this._unsubscribeAll) )
      .subscribe( (msg: string) => {
        this.updateReplayMessage(msg);
      }
    );

    this.charactersList = this.userService.getCharacters()
      .pipe(map((char: Character) => {
        return char.filter(char => char.status === 1);
      })
      );
  }

  private updateReplayMessage(msg: string) {
    const replayDialog = this.dialog.getDialogById('loginReplay');
    if(replayDialog) {
      replayDialog.componentInstance.data = {
        replayMessage: msg
      }
    }
  }

  loginCharacter(name: string) {
    // if ( !this.socketService.isConnected) {
    //   return;
    // }
    const values = { name: name, secret: 'ciccio' };

    this.openSpinnerDialog();

    this.loginClientService.login(values)
      .pipe(
        delay(1000),
        takeUntil(this._unsubscribeAll)
        )
      .subscribe((res) => {
        if (res === true) {
          const redirect = this.loginClientService.redirectUrl ? this.loginClientService.redirectUrl : '/webclient';
          this.router.navigate([redirect]).then( () => {
            this.loginClientService.replayMessage = '';
          });
        } else {
          // this.loginfailed = true;
        }
      })
  }

  private openSpinnerDialog(){
    const config = new MatDialogConfig;
    config.id = 'loginReplay';
    config.data = {
      replayMessage: 'PROVA'
    }
    const dialogRef = this.dialog.open(AlertComponent, config);
  }

  private closeSpinnerDialog() {
    this.dialog.closeAll();
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

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();    
  }
}
