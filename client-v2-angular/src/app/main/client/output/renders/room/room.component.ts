import { Component, Input, ViewEncapsulation, OnInit, AfterViewInit } from '@angular/core';
import { Room } from 'src/app/models/data/room.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'tg-room',
  templateUrl: './room.component.html',
  encapsulation: ViewEncapsulation.None
})
export class RoomComponent implements OnInit {
  @Input() html: Room;
  @Input() type: string;
  @Input() withExtra: boolean;
  @Input() lastDescription: any = '';

  inRoomContent: boolean;

  constructor() { 
  }

  ngOnInit(): void {
    if(this.html) {
      if (this.html.perscont || this.html.objcont) {
        this.inRoomContent = true;
      }
      else {
        this.inRoomContent = false;
      }
    }
  }

  getRoomImage(img: string ): string {
      const fullPathImage = environment.media_address + img;
      return fullPathImage;
  }
}
