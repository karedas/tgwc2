import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'tg-no-feature',
  templateUrl: './no-feature.component.html',
  styleUrls: ['./no-feature.component.scss']
})
export class NoFeatureComponent {

  dialogID = 'nofeature';

  constructor() {
  }

  // onClose(): void {
  //   this.dialogRef.close();
  // }
}
