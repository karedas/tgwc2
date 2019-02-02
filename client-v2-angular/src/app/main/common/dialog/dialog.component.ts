import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { DialogConfiguration } from './model/dialog.interface';
import { DialogService } from './dialog.service';

@Component({
  selector: 'tg-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DialogsComponent implements OnInit {

  @Input() id: string;
  config: DialogConfiguration  = new DialogConfiguration;

  visible: boolean = false;

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

  // remove self from modal service when directive is destroyed
  ngOnDestroy(): void {
    // this.dialogService.remove(this.id);
  }

  // open modal
  open(config: DialogConfiguration): void {
    this.config = Object.assign({}, this.config, config);
    this.visible = true;
  }

  // close modal
  close(): void {
    this.visible = false;
  }

}
