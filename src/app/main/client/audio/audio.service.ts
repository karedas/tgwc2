import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  public sound: HTMLAudioElement;
  public music: HTMLAudioElement;
  public playerStatus: BehaviorSubject<string> = new BehaviorSubject<string>('paused');


  constructor() {
    this.sound = new Audio();
    this.music = new Audio();

    this.music.volume = .4;
    this.sound.volume = .6;

    // this.attachListener();
  }

  setAudio(src: string): void {
    const mp3 = '.mp3';
    const mid = '.mid';
    const wav = '.wav';

    /** Music Channel */
    if (src.indexOf(mp3, src.length - mp3.length) !== -1) {
      this.setMusic(src);
    } else if (src.indexOf(mid, src.length - mid.length) !== -1) {
      this.setMusic(src.replace(mid, mp3));
    } else {
      this.setSound(src.replace(wav, mp3));
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

  public toggleAudio(): void {
    (this.music.paused) ? this.music.play() : this.music.pause();
  }
}
