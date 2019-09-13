import { Injectable } from '@angular/core';
import { GameService } from './game.service';
import { DialogV2Service } from '../common/dialog-v2/dialog-v2.service';
import { AudioService } from '../components/audio/audio.service';
import { LoginClientService } from '../../authentication/services/login-client.service';
import { ConfigService } from 'src/app/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class DispenserService {
  tgConfig: any;

  constructor(
    private gameService: GameService,
    private dialogV2Service: DialogV2Service,
    private loginClientService: LoginClientService,
    private audioService: AudioService,
    private configService: ConfigService
  ) {
   }

  do(what: string, ...args: any) {
    switch (what) {
      case 'disconnect': this.loginClientService.logout();
        break;
      case 'preferences':
        this.dialogV2Service.openControlPanel();
        break;
      case 'audio':
        this.audioService.toggleAudio();
        break;
      case 'log':
        this.dialogV2Service.openLog();
        break;
      case 'fontsize':
        this.gameService.setOutputSize();
        break;
      case 'shortcuts':
        this.dialogV2Service.openShortcut();
        break;
      case 'widgetRoom':
      case 'widgetEquipInv':
      case 'widgetCombat':
        this.tgConfig = this.gameService.tgConfig;
        this.configService.setConfig({
          [what]: { visible: !this.tgConfig[what].visible }
        });
        break;
      default:
        this.gameService.processCommands(what);
        return false;
    }
  }
}
