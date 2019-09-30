import { Injectable, ElementRef } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HistoryService } from '../../services/history.service';
import { GameService } from '../../services/game.service';

@Injectable({
  providedIn: 'root'
})
export class InputService {

  inputElement: ElementRef;

  constructor(
    private historyService: HistoryService,
    private gameService: GameService
  ) { }

  setInputRef(ic) {
    this.inputElement = ic;
  }

  getPreviousCmd() {
    if (!this.gameService.mouseIsOnMap) {
      const cmd = this.historyService.getPrevious();
      if (cmd) {
        this.inputElement.nativeElement.value = cmd;
        this.moveCursorAtEnd(this.inputElement.nativeElement);
      }
    }
  }

  getNextCmd() {
    if (!this.gameService.mouseIsOnMap) {
      const cmd = this.historyService.getNext();
      if (cmd) {
        this.inputElement.nativeElement.value = cmd;
        this.moveCursorAtEnd(this.inputElement.nativeElement);
      }
    }
  }

  moveCursorAtEnd(target) {
    if (typeof target.selectionStart === 'number') {
      target.selectionStart = target.selectionEnd = target.value.length;
    } else if (typeof target.createTextRange !== 'undefined') {
      this.focus();
      const range = target.createTextRange();
      range.collapse(false);
      range.selec();
    }
  }

  focus() {
    this.inputElement.nativeElement.focus();
  }
}
