import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter, ViewChild } from '@angular/core';
import { DialogConfiguration } from './model/dialog.interface';
import { Dialog } from 'primeng/dialog';
import { GenericDialogService } from './dialog.service';

@Component({
  selector: 'tg-dialog',
  templateUrl: './dialog.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class GenericDialogComponent implements OnInit {

  @Input() id: string;
  @ViewChild('dialog') dialog: Dialog;
  @Output() data: EventEmitter<any> = new EventEmitter<any>();
  @Output() isClosed: EventEmitter<boolean> = new EventEmitter();

  config: DialogConfiguration  = new DialogConfiguration;
  visible = false;

  constructor(
    private genericDialogService: GenericDialogService,
    ) {     }

  ngOnInit(): void {

    const modal = this;

    // ensure id attribute exists
    if (!this.id) {
      console.error('modal must have an id');
      return;
    }

    // add self (this modal instance) to the modal service so it's accessible from controllers
    this.genericDialogService.add(this);
  }

  // open modal
  open(config: DialogConfiguration) {
    // this.visible = true;
    this.visible = true;
    this.config = Object.assign({}, this.config, config);

    if (this.config.data) {
      this.data.emit(this.config.data);
    }

    setTimeout(() => {
      this.dialog.moveOnTop();
    });

  }

  // close modal
  close(): void {
    this.visible = false;
  }


  onHide(event: Event) {
    this.isClosed.emit(true);
  }


  bringToFront() {
    if(this.dialog) {
      this.dialog.moveOnTop();
    }
  }

  // remove self from modal service when directive is destroyed
  ngOnDestroy(): void {
    // this.dialogService.remove(this.id);
  }
}
