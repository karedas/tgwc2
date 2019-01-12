import { Component, ViewChild, ElementRef, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { faColumns, faSolarPanel, faBullseye } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { ClientState } from 'src/app/store/state/client.state';
import { updateUI, toggleExtraOutput } from 'src/app/store/actions/client.action';
import { UI } from 'src/app/models/client/ui.model';

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

  @ViewChild('inputCommand') ic: ElementRef;

  constructor(
    private game: GameService,
    private store: Store<ClientState>) { }

  ngAfterViewInit() {
    this.ic.nativeElement.focus();
  }

  onKeyDown(event: any, val: string) {
    event.target.value = '';
    this.game.processCommands(val, true);
  }

  collapseInterface(){
    this.store.dispatch(new toggleExtraOutput()); 
  }
  
  toggleControlPanel(){
    console.log('toggle control panel action');
  }
  
  toggleZen(){
    //this.store.dispatch(new updateUI({zen: true})); 
  }

}
