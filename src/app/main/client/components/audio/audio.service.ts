import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfigService } from 'src/app/services/config.service';

import { TGConfig } from '../../client-config';
import { TGAudio } from '../../models/audio.model';

const audioPath = 'assets/audio/';

@Injectable()
export class AudioService {
  tgConfig: TGConfig;
  _enable: boolean = false;
  playerStatus: BehaviorSubject<string> = new BehaviorSubject<string>('paused');

  sound: HTMLAudioElement;
  music: HTMLAudioElement;
  // Atmospheric Channels
  atmospheric: HTMLAudioElement;
  atmosphericEcho: HTMLAudioElement;
  echoInterval: any;

  constructor(private _configService: ConfigService) {
    this.setDefaultChannel();
    this.setAtmosphericChannel();

    this._configService.config
      .subscribe((config: TGConfig) => {
        this.enable = config.audio.enable;
        this.soundVolume = config.audio.soundVolume / 100;
        this.atmosphericVolume = config.audio.atmosphericVolume / 100;
        this.musicVolume = config.audio.musicVolume / 100;
      });
  }

  private setDefaultChannel() {
    this.sound = new Audio();
    this.music = new Audio();
  }

  private setAtmosphericChannel() {
    this.atmospheric = new Audio();
    this.atmospheric.loop = true;
    // echo
    this.atmosphericEcho = new Audio();
    this.atmosphericEcho.loop = true;
  }

  set enable(value: boolean) {
    this._enable = value;
    this.sound.muted = !this._enable;
    this.music.muted = !this._enable;
    this.atmospheric.muted = !this._enable;
    this.atmosphericEcho.muted = !this._enable;
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
    if (this._enable) {
      const mp3 = '.mp3';
      const mid = '.mid';
      const wav = '.wav';

      /**
       * Delivery to default Channel: Music + Sound Channel 
       * or to Atmospheric Channel */
      if (audio.channel === 'music') {
        if (audio.track.indexOf(mp3, audio.track.length - mp3.length) !== -1) {
          this.setMusic(audio.track);
        } else if (audio.track.indexOf(mid, audio.track.length - mid.length) !== -1) {
          this.setMusic(audio.track.replace(mid, mp3));
        } else {
          this.setSound(audio.track.replace(wav, mp3));
        }
      } else if (audio.channel === 'atmospheric' && audio.track) {
        if (audio.track === this.atmospheric.src) {
          console.log('return same track')
          return;
        }
        if (!audio.track) {
          console.log('no track provided')
          clearInterval(this.echoInterval);
          return;
        }

        this.setAtmospheric(audio.track);
      }
    }
  }

  public getMusic(): HTMLAudioElement {
    return this.music;
  }

  public setMusic(src: string): void {
    this.music.src = audioPath + src;
    this.music.load();
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
    this.sound.src = audioPath + src;
    this.sound.load();
    this.playSound();
  }

  public playSound(): void {
    this.sound.play();
  }

  public getAtmospheric(): HTMLAudioElement {
    return this.atmospheric;
  }

  public setAtmospheric(src: string): void {
    this.atmospheric.src = audioPath + 'atmospherics/' + src;
    this.atmosphericEcho.src = this.atmospheric.src;
    this.atmospheric.load();
    this.playAtmospheric();
  }

  public playAtmospheric(): void {
    console.log('TGLOG: Atmospheric Music channel starts');
    this.atmospheric.play();
    setTimeout(() => {
      console.log('TGLOG: Atmospheric Echo Added');
      console.log(this.atmosphericEcho.src);
      this.atmosphericEcho.play();
    }, 25000);
  }

  public toggleAudio(): void {
    // store in configuration
    this._configService.setConfig({
      audio: { enable: this.enable = !this.enable }
    });
  }
}
