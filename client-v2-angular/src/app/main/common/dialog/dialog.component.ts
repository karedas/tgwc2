import { Component, OnInit, Input, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { DialogService } from './trash/dialog.service';
import { ModalConfiguration } from './model/modal.interface';
import { Observable } from 'rxjs';


@Component({
  selector: 'tg-dialog',
  encapsulation: ViewEncapsulation.None
})
export class DialogComponent  implements OnInit, OnDestroy {

  // @ViewChild('jqxWidget') jqxWindow: jqxWindowComponent;

  @Input() id: string;
  @Input('titleDialog') titleDialog: string;
  @Input('config') config: ModalConfiguration = new ModalConfiguration();

  constructor(
    private dialogService: DialogService,
    ) {}

  ngOnInit(): void {
    // const modal = this;
    // // ensure id attribute exists
    // if (!this.id) {
    //   console.error('modal must have an id');
    //   return;
    // }
    // // add self (this modal instance) to the modal service so it's accessible from controllers
    // this.dialogService.add(this);
  }


  // setOptions(args: any) {
  //   this.jqxWindow.setOptions(args);
  // }

  // open(): void {
  //   this.jqxWindow.open();
  // }

  // close(): void {
  //   this.jqxWindow.close();
  // }

  // toFront(): void {
  //   this.jqxWindow.bringToFront();
  // }

  // resize(): void {
  //   this.jqxWindow.resize;
  // }

  ngOnDestroy(): void {
  //   this.dialogService.remove(this.id);
  //   this.jqxWindow.destroy();
  }
}
