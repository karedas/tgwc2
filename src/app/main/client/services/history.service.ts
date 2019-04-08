import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  /** Cmd History */
  private max_history_length = 40;
  private cmd_history_pos = 0;
  public cmd_history: any[] = [];

  constructor() {
    console.log('history');
  }

  push(value: string) {
    if (value.length > 0) {
      if (this.cmd_history.length >= this.max_history_length) {
        this.cmd_history.shift();
      }
      if (this.cmd_history.length === 0 || this.cmd_history[this.cmd_history.length - 1] !== value) {
        this.cmd_history.push(value);
      }
      this.cmd_history_pos = this.cmd_history.length;
    }
  }

  getPrevious() {
    if (this.cmd_history_pos > 0) {
      this.cmd_history_pos--;
      return this.getCmdByPosition();
    }
  }

  getNext(): string  {
    if (this.cmd_history_pos < this.cmd_history.length) {
      this.cmd_history_pos++;
      return this.getCmdByPosition();
    }
  }

  private getCmdByPosition(): string {
    const cmd = this.cmd_history[this.cmd_history_pos] ? this.cmd_history[this.cmd_history_pos] : ' ';
    return cmd;
  }


}
