import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TGConfig } from '../../client-config';
import { ConfigService } from 'src/app/services/config.service';
import { TGAudio } from '../../models/audio.model';
@Injectable({
  providedIn: 'root'
})
export class AudioService {

  tgConfig: TGConfig;

  public sound: HTMLAudioElement;
  public music: HTMLAudioElement;
  public atmospheric: HTMLAudioElement;
  public _enable = false;
  public playerStatus: BehaviorSubject<string> = new BehaviorSubject<string>('paused');


  constructor(
    private _configService: ConfigService
  ) {
    this.sound = new Audio();
    this.music = new Audio();
    this.atmospheric = new Audio();
    this.atmospheric.loop = true;
  }

  set enable(value: boolean) {
    this._enable = value;
    this.sound.muted = !this._enable;
    this.music.muted = !this._enable;
    this.atmospheric.muted = !this._enable;
  }

  get enable(): boolean {
    return this._enable;
  }

  set soundVolume(value: number) {
    this.sound.volume = value;
  }

  set atmosphericVolume(value: number) {
    this.atmospheric.volume = value;
  }

  set musicVolume(value: number) {
    this.music.volume = value;
  }

  setAudio(audio: TGAudio): void {
    if(this._enable) {
      const mp3 = '.mp3';
      const mid = '.mid';
      const wav = '.wav';
  
      /** Music && Sound Channel */
      if(audio.channel === 'music') {
        console.log('TGLOG: Sound and Music channel Starts')
        if (audio.track.indexOf(mp3, audio.track.length - mp3.length) !== -1) {
          this.setMusic(audio.track);
        } else if (audio.track.indexOf(mid, audio.track.length - mid.length) !== -1) {
          this.setMusic(audio.track.replace(mid, mp3));
        } else {
          this.setSound(audio.track.replace(wav, mp3));
        }
      } else if (audio.channel === 'atmospheric') {
        console.log('TGLOG: Atmospheric Music channel starts')
        this.setAtmospheric(audio.track);
        /** Atmospheric Channel */
      } 
    }
  }

  public getMusic(): HTMLAudioElement {
    return this.music;
  }

  public setMusic(src: string): void {
    this.music.src = 'assets/audio/' + src;
    this.playMusic();
  }

  public playMusic(): void {
    this.music.play();
  }

  public pauseAudio(): void {

    this.music.pause();
    this.music.currentTime = 0;
    this.sound.pause();
    this.sound.currentTime = 0;
  }

  public getSound(): HTMLAudioElement {
    return this.sound;
  }

  public setSound(src: string): void {

    this.sound.src = 'assets/audio/' + src;
    this.playSound();
  }

  public playSound(): void {
    this.sound.play();
  }

  public getAtmospheric(): HTMLAudioElement {
    return this.atmospheric;
  }

  public setAtmospheric(src: string): void {

    this.atmospheric.src = 'assets/audio/atmospherics/' + src;
    this.playAtmospheric();
  }

  public playAtmospheric(): void {
    this.atmospheric.play();
  }

  public toggleAudio(): void {
    // store in configuration
    this._configService.setConfig({
      audio: {enable: this.enable = !this.enable}
    });
  }
}
