import { Component, OnInit, ViewChild } from '@angular/core';
import { AudioService } from './audio.service';
import { Store, select } from '@ngrx/store';
import { ClientState } from 'src/app/store/state/client.state';
import { getAudioTrack } from 'src/app/store/selectors';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'tg-audio',
  templateUrl: './audio.component.html',
})
export class AudioComponent {

  constructor(private audioService: AudioService, private store: Store<ClientState>) {

    this.store.pipe(select(getAudioTrack), filter(state => !!state ))
        .subscribe(
          track => this.audioService.setAudio(track)
      );
  }
}