import { Component, OnInit, OnDestroy } from '@angular/core';
import { AudioService } from './audio.service';
import { Store, select } from '@ngrx/store';
import { getAudioTrack } from 'src/app/store/selectors';
import { filter, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { ClientState } from 'src/app/store/state/client.state';

@Component({
  selector: 'tg-audio',
  template: ''
})
export class AudioComponent implements OnInit, OnDestroy {

  music$: Observable<any>;
  private _unsubscribeAll: Subject<any>;

  constructor(private audioService: AudioService, private store: Store<ClientState>) {

    this.music$ = this.store.pipe(select(getAudioTrack));
    this._unsubscribeAll = new Subject<any>();

  }

  ngOnInit(): void {
    this.music$.pipe(filter(state => !!state )).pipe(
      takeUntil(this._unsubscribeAll)).subscribe(
      track => this.audioService.setAudio(track)
    );
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
