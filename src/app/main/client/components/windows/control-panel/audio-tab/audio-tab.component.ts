import { Component, OnInit, OnDestroy } from '@angular/core';
import { AudioService } from '../../../audio/audio.service';
import { ConfigService } from 'src/app/services/config.service';
import { MatSliderChange } from '@angular/material';
import { TGConfig } from 'src/app/main/client/client-config';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'tg-audio-tab',
  templateUrl: './audio-tab.component.html',
  styleUrls: ['./audio-tab.component.scss']
})
export class AudioTabComponent implements OnInit, OnDestroy {
  tgConfig: TGConfig;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private audioService: AudioService,
    private configService: ConfigService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.configService.config
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
      this.configService.setConfig({
        audio: { soundVolume: event.value }
      });
    } else if (source === 'music') {
      this.configService.setConfig({
        audio: { musicVolume: event.value }
      });
    } else if (source === 'enable') {
      this.audioService.toggleAudio();
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
