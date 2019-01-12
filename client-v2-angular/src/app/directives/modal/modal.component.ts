import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { ModalsService } from './modal.service';
import { jqxWindowComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow';
import { ModalConfiguration } from 'src/app/models/client/modal.interface';


@Component({
  selector: 'tg-modal',
  templateUrl: './modal.component.html',
 //  styleUrls: ['./modal.component.scss']
})
export class ModalComponent  implements OnInit, OnDestroy {

  @ViewChild('jqxWidget') jqxWidget: jqxWindowComponent;
  @Input() id: string;
  @Input() config: ModalConfiguration = new ModalConfiguration();

  constructor(
    private modalService: ModalsService, 
    ) { 

  }

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
    this.jqxWidget.open();
  }

  close(): void {
    this.jqxWidget.close();
  }

  ngOnDestroy(): void {
    this.modalService.remove(this.id);
    this.jqxWidget.destroy();
  }
}
