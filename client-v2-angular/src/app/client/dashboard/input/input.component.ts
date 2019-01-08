import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'tg-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})

export class InputComponent implements AfterViewInit{
  @ViewChild('inputCommand') ic:ElementRef;

  constructor(private game: GameService) { }

  ngAfterViewInit() {
    this.ic.nativeElement.focus();
  }

  onKeyDown(event: any, val: string) {
    event.target.value = '';
    this.game.processCommands(val, true);
  }

}
