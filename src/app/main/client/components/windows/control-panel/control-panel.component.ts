import { Component, OnInit, OnDestroy, ViewEncapsulation, Inject } from '@angular/core';
import { TGConfig } from '../../../client-config';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSliderChange } from '@angular/material/slider';
import { AudioService } from '../../audio/audio.service';
import { FileSaverService } from 'ngx-filesaver';
import { font_size_options } from 'src/app/main/client/common/constants';
import { GameService } from '../../../services/game.service';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'tg-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ControlPanelComponent implements OnInit, OnDestroy {

  tgConfig: TGConfig;

  private _unsubscribeAll: Subject<any>;

  fileUploaded = false;
  tabOpen = 0;

  oldFontSize: number;

  fontSizes = font_size_options;

  constructor(
    private _configService: ConfigService,
    private audioService: AudioService,
    private gameService: GameService,
    private _FileSaverService: FileSaverService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this._unsubscribeAll = new Subject();
    this.tabOpen = data.tab;
  }

  ngOnInit() {
    this._configService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.tgConfig = config;
      });
  }

  changeFontSize(event: any) {
    this.oldFontSize = this.tgConfig.fontSize;
    this.gameService.setOutputSize(event.value, this.oldFontSize);
  }

  onOptionChange(event, value: any) {
    this._configService.setConfig(value);
  }

  // Format audio to Decimal only for user view
  formatAudio(value: number | null) {
    if (!value) {
      return 0;
    }

    return value;
  }

  onAudioChange(event: MatSliderChange, source: string) {

    if (source === 'sound') {
      this._configService.setConfig({
        audio: { soundVolume: event.value }
      });
    } else if (source === 'music') {
      this._configService.setConfig({
        audio: { musicVolume: event.value }
      });
    } else if (source === 'enable') {
      this.audioService.toggleAudio();
    }
  }

  setTab(index: number) {
    this.tabOpen = index;
    this.fileUploaded = false;
  }

  saveConfig() {
    const conf = localStorage.getItem('config');
    this._FileSaverService.saveText(conf, 'tgconfig');
  }

  uploadConfig(event: any) {

    const file: any = event.target.files[0];

    if (file) {
      const fileReader = new FileReader();

      fileReader.onload = (e) => {
        const result = fileReader.result;
        if (typeof result === 'string') {
          const newConf = JSON.parse(result);
          this._configService.setConfig(newConf);

          this.fileUploaded = true;
        }
      };
      fileReader.readAsText(file);
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
