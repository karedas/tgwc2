import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { IObjPersDesc } from 'src/app/models/data/objpers.model';

@Component({
  selector: 'tg-objpers-detail',
  templateUrl: './objpers-detail.component.html',
  styleUrls: ['./objpers-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObjpersDetailComponent implements OnInit {

  @Input() html: IObjPersDesc;

  constructor() { }

  ngOnInit() {


  }

}
