import { Component, OnInit } from '@angular/core';
import { DialogService } from 'src/app/main/common/dialog/trash/dialog.service';
import { ModalConfiguration } from 'src/app/main/common/dialog/model/modal.interface';

@Component({
  selector: 'tg-no-feature',
  templateUrl: './no-feature.component.html',
  styleUrls: ['./no-feature.component.scss']
})
export class NoFeatureComponent implements OnInit {

  dialogID = 'noFeatureDialog';
  modalConfig: ModalConfiguration = new ModalConfiguration();


  constructor(private dialogService: DialogService) {
    this.modalConfig.width = 'auto';
  }

  ngOnInit() {
  }

  onClose(): void {
    // this.dialogService.close(this.dialogID);
  }

}
