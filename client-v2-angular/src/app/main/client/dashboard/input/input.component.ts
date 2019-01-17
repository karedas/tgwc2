import { Component, ViewChild, ElementRef, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { faColumns, faSolarPanel, faBullseye } from '@fortawesome/free-solid-svg-icons';
import { Store, select } from '@ngrx/store';
import { ClientState } from 'src/app/store/state/client.state';
import { ToggleExtraOutput, ToggleDashboard } from 'src/app/store/actions/ui.action';
import { HistoryService } from 'src/app/services/history.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { getUIState } from 'src/app/store/selectors';
import { map } from 'rxjs/operators';

@Component({
  selector: 'tg-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class InputComponent implements AfterViewInit {
  
  facolumns = faColumns;
  faSolarPanel = faSolarPanel;
  faBullseye = faBullseye;

  extraStatus: boolean;
  zenStatus$: BehaviorSubject<boolean>;

  @ViewChild('inputCommand') ic: ElementRef;

  constructor(
    private game: GameService,
    private store: Store<ClientState>,
    private historyService: HistoryService
    ) { 
      this.store.pipe(select(getUIState), map( ui => ui.extraOutput )).subscribe(
        status  => { this.extraStatus = status; console.log(this.extraStatus); }
      );
    }

  ngAfterViewInit() {
    this.ic.nativeElement.focus();
  }

  onEnter(event: any, val: string) {
    event.target.value = '';
    this.game.processCommands(val, true);
  }

  onUpKey(event: any) {
    const cmd = this.historyService.getPrevious();
    if(cmd) {
      event.target.value = cmd;
    }
  }

  onDownKey(event: any) {
    const cmd =  this.historyService.getNext();
    if(cmd) { 
      event.target.value =  cmd;
    }
  }

  collapseInterface(){
    this.store.dispatch(new ToggleExtraOutput()); 
  }
  
  toggleControlPanel(){
    this.store.dispatch(new ToggleDashboard());
  }
  
  toggleZen(){
    //this.store.dispatch(new updateUI({zen: true})); 
  }

}
