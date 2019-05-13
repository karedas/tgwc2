import { Component } from '@angular/core';

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
