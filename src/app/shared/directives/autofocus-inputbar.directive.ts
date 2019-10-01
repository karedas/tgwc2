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
    if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
      if (activeElement.id !== 'inputcommand') {
        return;
      }
    }
    // Return back if user uses "CTRL" key
    if (event.ctrlKey) {
      return;
    }

    if ( event.key !== 'Escape') {
      this.inputService.focus();
    }

    switch (event.key) {
      case 'ArrowUp':
        this.inputService.getPreviousCmd();
        break;
      case 'ArrowDown':
        this.inputService.getNextCmd();
        break;
    }
  }
}
