import { Component, OnInit } from '@angular/core';
import { DialogService } from 'src/app/main/common/dialog/dialog.service';

@Component({
  selector: 'tg-no-feature',
  templateUrl: './no-feature.component.html',
  styleUrls: ['./no-feature.component.scss']
})
export class NoFeatureComponent implements OnInit {

  dialogID = 'noFeatureDialog';

  constructor(private dialogService: DialogService) { }

  ngOnInit() {
  }

  onClose(): void {
    this.dialogService.close(this.dialogID);
  }

}
