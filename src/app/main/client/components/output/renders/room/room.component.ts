import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Room } from 'src/app/main/client/models/data/room.model';
import { environment } from 'src/environments/environment';
import { GameService } from 'src/app/main/client/services/game.service';

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
  @Input() draggingSplitArea: boolean;

  inRoomContent: boolean;

  constructor(private game: GameService) {
  }

  ngOnInit(): void {
    if (this.html) {
      if (this.html.perscont || this.html.objcont) {
        this.inRoomContent = true;
      } else {
        this.inRoomContent = false;
      }
    }
  }

  onBackDetail(num: number) {
    if (num) {
      this.game.processCommands(`guarda &${num}`);
    } else { this.game.processCommands('guarda'); }
  }

  getRoomImage(img: string ): string {
      const fullPathImage = environment.media_address + img;
      return fullPathImage;
  }
}
