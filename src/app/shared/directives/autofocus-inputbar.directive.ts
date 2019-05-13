import { Directive, HostListener } from '@angular/core';
import { InputService } from 'src/app/main/client/input/input.service';
import { MatDialog } from '@angular/material';

@Directive({
  selector: '[tgAutofocusInputbar]'
})
export class AutofocusInputbarDirective {
  constructor(
    private dialog: MatDialog,
    private inputService: InputService
  ) {
  }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.key !== 'Escape' &&
      event.key !== 'ArrowDown' &&
      event.key !== 'ArrowLeft' &&
      event.key !== 'ArrowRight' &&
      event.key !== 'ArrowUp' &&
      !this.dialog.openDialogs.length
    ) {
      this.inputService.focus();
    }
  }
}
