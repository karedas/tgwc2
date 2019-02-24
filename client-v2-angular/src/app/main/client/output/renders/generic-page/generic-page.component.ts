import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { IGenericPage } from 'src/app/models/data/genericpage.model';

@Component({
  selector: 'tg-generic-page',
  templateUrl: './generic-page.component.html',
  styleUrls: ['./generic-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class GenericPageComponent implements OnInit {

  @Input('html') html: IGenericPage;
  
  constructor() { }

  ngOnInit() {
  }

}
