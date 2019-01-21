import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { DialogService } from './dialog.service';
import { jqxWindowComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow';
import { ModalConfiguration } from 'src/app/models/client/modal.interface';
import { InsertionDirective } from './insertion.directive';


@Component({
  selector: 'tg-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent  implements OnInit, OnDestroy {

  @ViewChild('jqxWidget') jqxWindow: jqxWindowComponent;
  
  @Input() id: string;
  @Input('config') config: ModalConfiguration = new ModalConfiguration();

  insertionPoint: InsertionDirective;


  constructor(
    private modalService: DialogService, 
    ) {}

  ngOnInit(): void{
    let modal = this;
    // ensure id attribute exists
    if (!this.id) {
      console.error('modal must have an id');
      return;
    }
    // add self (this modal instance) to the modal service so it's accessible from controllers
    this.modalService.add(this);
  }

  open(): void {
    this.jqxWindow.open();
  }

  close(): void {
    this.jqxWindow.close();
  }

  ngOnDestroy(): void {
    this.modalService.remove(this.id);
    this.jqxWindow.destroy();
  }
}
