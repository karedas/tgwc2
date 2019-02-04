import { Component, OnInit, Input, ViewEncapsulation, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { DialogConfiguration } from './model/dialog.interface';
import { DialogService } from './dialog.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'tg-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogsComponent implements OnInit {

  @Input() id: string;
  @Output() isClosed: EventEmitter<boolean> = new EventEmitter();


  config: DialogConfiguration  = new DialogConfiguration;
  visible: boolean = false;

  private dialog: Dialog;
  

  constructor(
    private dialogService: DialogService,
    ) { }

  ngOnInit(): void {

    let modal = this;

    // ensure id attribute exists
    if (!this.id) {
      console.error('modal must have an id');
      return;
    }

    // add self (this modal instance) to the modal service so it's accessible from controllers
    this.dialogService.add(this);
  }
  
  // open modal
  open(config: DialogConfiguration) {
    this.visible = true;
    this.config = Object.assign({}, this.config, config);
  }
  
  // close modal
  close(): void {
    this.visible = false;
  }
  

  onHide() {
    this.isClosed.emit(true);
  }

  // remove self from modal service when directive is destroyed
  ngOnDestroy(): void {
    // this.dialogService.remove(this.id);
  }

}
