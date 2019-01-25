import { Component, OnInit } from '@angular/core';
import { AudioService } from './audio.service';
import { Store, select } from '@ngrx/store';
import { ClientState } from 'src/app/store/state/client.state';
// import { getAudioTrack } from 'src/app/store/selectors';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { getAudioTrack } from 'src/app/store/selectors';

@Component({
  selector: 'tg-audio',
  templateUrl: './audio.component.html',
})
export class AudioComponent implements OnInit {

  music$: Observable<any>;

  constructor(private audioService: AudioService, private store: Store<ClientState>) {

    this.music$ = this.store.pipe(select(getAudioTrack));

  }

  ngOnInit(): void {
    this.music$.pipe(filter(state => !!state )).subscribe(
      track => this.audioService.setAudio(track)
    );    
  }

  ngOnDestroy(): void {
  
  }
}
