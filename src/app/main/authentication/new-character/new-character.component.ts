import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { tgAnimations } from 'src/app/animations';

@Component({
  selector: 'tg-new-character',
  templateUrl: './new-character.component.html',
  styleUrls: ['./new-character.component.scss'],
  animations: [tgAnimations],
  encapsulation: ViewEncapsulation.None
})
export class NewCharacterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
