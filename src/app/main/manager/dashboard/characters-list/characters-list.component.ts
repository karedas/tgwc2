import { Component, ViewEncapsulation, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ethnicity } from 'src/assets/data/ethnicity/ethnicity.const';
import { UserService } from 'src/app/core/services/user.service';
import { Subject } from 'rxjs';
import { takeUntil, delay } from 'rxjs/operators';
import { Character } from 'src/app/core/models/character.model';
import { LoginClientService } from 'src/app/main/client/services/login-client.service';
import { Router } from '@angular/router';
import { MatDialogRef, MatDialogConfig, MatDialog, MatTableDataSource, MatSort } from '@angular/material';
import { AlertComponent } from 'src/app/main/common/components/dialogs/alert/alert.component';
import { tgAnimations } from 'src/app/animations';


@Component({
  selector: 'tg-characters-list',
  templateUrl: './characters-list.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: [tgAnimations],
})
export class CharactersListComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @Output() goToManage = new EventEmitter();
  readonly env = environment;
  readonly ethnicity = ethnicity;
  readonly maxCharacter: number;
  readonly displayedColumns: string[] = ['image', 'name', 'actions', 'expand'];

  expandedElement: [];
  charactersList: MatTableDataSource<Character[]>;
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

    this.userService.getCharacters()
      .subscribe( charslist => {
        const cdata = this.sortCharacterList(charslist);
        this.charactersList = new MatTableDataSource(cdata);
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

  private sortCharacterList(list): any {
    return list.sort(function(a, b) {
      if (a.is_default === true && !b.is_default) {
        return -1;
      } else { return 1; }
    });
  }


  private redirectToClient() {
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


  /** Public  */

  public loginCharacter(name: string, secret: string, event: Event) {
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
      });
  }

  public goToChractersManage() {
    this.goToManage.emit();
  }

  public onDisableChar(pgname: string): void {
    pgname = pgname.toUpperCase();
    const confirm = prompt(`Attenzione, l\'operazione non potrà essere annullata.
      Se sei certo di questa scelta digita qui sotto "${pgname}" e premi Ok`, ``);

    if (confirm != null && confirm === pgname) {
      // DISABLE Character!!
    }
  }

  public onRemoveCharFromAccount(id: number) {
    // this.userService
    this.userService.removeCharacterFromAccount(id)
      .subscribe((res)  => {
      });
  }

  public onSelectedPrimary(id: number) {
    const cdata = this.charactersList.data;
    for (const c in cdata) {
      if (cdata[c]['id'] === id && !cdata[c]['is_default']) {
        cdata[c]['is_default'] = true;
        this.userService.setDefaultCharacter(cdata[c]).subscribe();
      } else {
        cdata[c]['is_default'] = false;
      }
    }
    this.charactersList = new MatTableDataSource(this.sortCharacterList(cdata));
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}