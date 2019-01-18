import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { getInGameStatus } from 'src/app/store/selectors';
import { ClientState } from 'src/app/store/state/client.state';

@Component({
  selector: 'tg-login-smart',
  templateUrl: './login-smart.component.html',
  styleUrls: ['./login-smart.component.scss']
})
export class LoginSmartComponent implements OnInit {
  
  inGameState$: Observable<boolean>;

  constructor(private store: Store<ClientState>) {
  }
  
  ngOnInit() {
    this.inGameState$ = this.store.select(getInGameStatus);
    this.store.select(getInGameStatus).subscribe(a=> {console.log(a)})
  }
}
