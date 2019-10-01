import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';

import { TGConfig } from '../../client-config';
import { AudioService } from './audio.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TGAudio } from '../../models/audio.model';

@Component({
  selector: 'tg-audio',
  template: '',
})
export class AudioComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any>;

  constructor(
    private audioService: AudioService,
    private _configService: ConfigService,
    ) {
    this._unsubscribeAll = new Subject<any>();
  }

  ngOnInit(): void {

    this._configService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe( (config: TGConfig ) => {
        this.audioService.enable = config.audio.enable;
        this.audioService.soundVolume = config.audio.soundVolume / 100;
        this.audioService.atmosphericVolume = config.audio.atmosphericVolume / 100;
        this.audioService.musicVolume = config.audio.musicVolume / 100;
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
