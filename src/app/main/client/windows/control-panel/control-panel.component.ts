import { Component, OnInit, OnDestroy } from '@angular/core';
import { TGConfig, tgConfig } from '../../client-config';
import { ConfigService } from 'src/app/services/config.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSliderChange } from '@angular/material';
import { AudioService } from '../../audio/audio.service';

@Component({
  selector: 'tg-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit, OnDestroy {

  tgConfig: TGConfig;

  private _unsubscribeAll: Subject<any>;
  tabOpen: number = 0;

  constructor(
    private _configService: ConfigService,
    private audioService: AudioService
  ) {

    this._unsubscribeAll = new Subject();
   }

  ngOnInit() {
    this._configService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.tgConfig = config;
      });
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
        audio: {soundVolume: event.value }
      })
    } 
    else if (source === 'music') {
      this._configService.setConfig({
        audio: { musicVolume: event.value }
      })
    }
    else if (source === 'enable') {
      this.audioService.toggleAudio();
    }
  }

  setTab(index: number) {
    this.tabOpen = index;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
