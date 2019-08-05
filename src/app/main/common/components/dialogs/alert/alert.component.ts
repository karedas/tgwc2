import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'tg-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {

  dialogID = 'alert';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
  ) {
    console.log(data);
  }

  // onClose(): void {
  //   this.dialogRef.close();
  // }
}
