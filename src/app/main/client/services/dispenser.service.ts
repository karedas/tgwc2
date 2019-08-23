import { Injectable } from '@angular/core';
import { GameService } from './game.service';
import { DialogV2Service } from '../common/dialog-v2/dialog-v2.service';
import { AudioService } from '../components/audio/audio.service';

@Injectable({
  providedIn: 'root'
})
export class DispenserService {

  constructor(
    private gameService: GameService,
    private dialogV2Service: DialogV2Service,
    private audioService: AudioService
  ) { console.log('dispenser loaded'); }

  do(what: string, ...args: any) {
    console.log(what);
    switch (what) {
      case 'disconnect':
        this.gameService.disconnect();
        break;
      // case 'news':
      //   this.dialogV2Service.openNews(true);
      //   break;
      case 'preferences':
        this.dialogV2Service.openControlPanel();
        break;
      case 'audio':
        this.audioService.toggleAudio();
        break;
      case 'log':
        this.dialogV2Service.openLog();
        break;

      default:
        this.gameService.processCommands(what);
        return false;
    }
  }
}
