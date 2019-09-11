import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { IObjPersDesc, IObjectAndPerson } from 'src/app/main/client/models/data/objpers.model';

@Component({
  selector: 'tg-objpers-detail',
  templateUrl: './objpers-detail.component.html',
  styleUrls: ['./objpers-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObjpersDetailComponent {

  @Input() html: IObjectAndPerson;

  constructor() {
   }
}
