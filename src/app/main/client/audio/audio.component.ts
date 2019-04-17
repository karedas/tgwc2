import { Component, OnInit, OnDestroy } from '@angular/core';
import { AudioService } from './audio.service';
import { Store, select } from '@ngrx/store';
import { getAudioTrack } from 'src/app/store/selectors';
import { filter, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { ClientState } from 'src/app/store/state/client.state';
import { ConfigService } from 'src/app/services/config.service';
import { TGConfig } from '../client-config';

@Component({
  selector: 'tg-audio',
  template: ''
})
export class AudioComponent implements OnInit, OnDestroy {

  music$: Observable<any>;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private audioService: AudioService,
    private _configService: ConfigService,
    private store: Store<ClientState>
    ) {
    this.music$ = this.store.pipe(select(getAudioTrack));
    this._unsubscribeAll = new Subject<any>();
  }

  ngOnInit(): void {

    this._configService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe( (config: TGConfig ) => {
        this.audioService.enable = config.audio.enable;
        this.audioService.soundVolume = config.audio.soundVolume;
        this.audioService.musicVolume = config.audio.musicVolume;
      });

    this.music$
      .pipe(
        filter(state => !!state ),
        takeUntil(this._unsubscribeAll))
      .subscribe(track =>
        this.audioService.setAudio(track)
      );
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
