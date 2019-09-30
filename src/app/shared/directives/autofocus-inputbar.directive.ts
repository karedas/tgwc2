import { Directive, HostListener } from '@angular/core';
import { InputService } from 'src/app/main/client/components/input/input.service';
import { MatDialog } from '@angular/material/dialog';

@Directive({
  selector: '[tgAutofocusInputbar]'
})
export class AutofocusInputbarDirective {
  constructor(
    private inputService: InputService
  ) {
  }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    const activeElement = document.activeElement;
    if (
      (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') &&
      activeElement.id !== 'inputcommand'
    ) {
      return;
    }
    if ( event.key !== 'Escape') {
      this.inputService.focus();
    }

    if(event.key === 'ArrowUp') {
      this.inputService.getPreviousCmd();
    }
    if(event.key === 'ArrowDown') {
      this.inputService.getNextCmd();
    }
  }
}
