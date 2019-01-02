import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'tg-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RoomComponent {
  @Input() html: any;
  constructor() { }

}
