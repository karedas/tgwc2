import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { getInGameStatus } from 'src/app/store/selectors';
import { ClientState } from 'src/app/store/state/client.state';
import { skip, takeUntil } from 'rxjs/operators';
import { ModalConfiguration } from 'src/app/models/client/modal.interface';
import { Router } from '@angular/router';
import { DisconnectAction } from 'src/app/store/actions/client.action';
import { DialogService } from 'src/app/main/common/dialog/dialog.service';

@Component({
  selector: 'tg-login-smart',
  templateUrl: './login-smart.component.html',
  styleUrls: ['./login-smart.component.scss']
})
export class LoginSmartComponent implements OnInit, OnDestroy  {
  
  inGameState$: Observable<boolean>;
  modalConfig: ModalConfiguration = new ModalConfiguration;
  private _unsubscribeAll: Subject<any>;


  constructor(
    private store: Store<ClientState>, 
    private dialogService: DialogService, 
    private router: Router) {

    this.modalConfig.width = 'auto'
    this.modalConfig.modalOpacity = 0.9;
    this.modalConfig.resizable = false;
    
    this.inGameState$ = this.store.select(getInGameStatus);
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.inGameState$.pipe(
      takeUntil(this._unsubscribeAll),
      skip(1)).subscribe(
      ingame => { 
        if(ingame == false) { this.open()}
      }
    )
  }

  private open () {
    setTimeout(() => {
      this.dialogService.open('loginWidget');
    });
  }


  navigateToHome() {
    this.store.dispatch(new DisconnectAction);
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
