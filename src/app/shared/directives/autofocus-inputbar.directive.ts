import { Directive, HostListener } from '@angular/core';
import { InputService } from 'src/app/main/client/components/input/input.service';
import { MatDialog } from '@angular/material/dialog';

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
      // ((!event.ctrlKey || !event.metaKey) && event.keyCode !== 67) &&
      !this.dialog.openDialogs.length
    ) {
      this.inputService.focus();
    }
  }
}
