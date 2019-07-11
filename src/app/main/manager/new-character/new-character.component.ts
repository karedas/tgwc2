import { Component, OnInit } from '@angular/core';
import { tgAnimations } from 'src/app/animations';

@Component({
  selector: 'tg-new-character',
  templateUrl: './new-character.component.html',
  styleUrls: ['./new-character.component.scss'],
  animations: [tgAnimations],
})
export class NewCharacterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
