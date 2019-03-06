import { Injectable, ElementRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapSnowService {

  canvasSnow: HTMLCanvasElement | null;
  canvasID: string;
  contextSnow: CanvasRenderingContext2D;
  framerate: number;
  flakeNumberModifier: number;
  fallSpeedModifier: number;
  width: number;
  height: number;
  numFlakes: number | null;
  flakes: any[];
  flake: HTMLCanvasElement;
  radHeight: number;
  tickHandler: any;

  prepareSnowCanvas(snowElement: ElementRef) {
    /* --- config start --- */
    this.canvasID = 'snowCanvas';
    this.contextSnow = null;
    this.framerate = 40; // which fps rate to use, this is not followed exactly
    this.flakeNumberModifier = 1.0; // change this to change the number of flakes
    this.fallSpeedModifier = 0.5; // falling speed
    this.width = 0;
    this.height = 0;
    this.numFlakes = null;
    this.flakes = [];
    this.flake =  <HTMLCanvasElement>document.createElement('CANVAS');
    this.radHeight = 40;
    this.contextSnow =  (<HTMLCanvasElement>snowElement.nativeElement).getContext('2d');
    this.width = snowElement.nativeElement.width;
    this.height = snowElement.nativeElement.height;
    this.numFlakes = Math.min(this.width, 300) * this.height / 400 * this.flakeNumberModifier;

    const TWO_PI = Math.PI * 2;
    const flakeContext = this.flake.getContext('2d');

    // create flake grafic
    this.flake.width = 8;
    this.flake.height = 8;
    flakeContext.fillStyle = '#fff';
    flakeContext.beginPath();
    flakeContext.arc(4, 4, 4, 0, TWO_PI);
    flakeContext.fill();

    // init snowflakes
    for (let x = 0; x < this.numFlakes; x++) {
      this.flakes[x] = this.getRandomFlake(true);
    }

  }

  // main routine
  private tick() {

    let posX = 0;

    // reset canvas for next frame
    this.contextSnow.clearRect(0, 0, this.width, this.height);

    for (let x = 0; x < this.numFlakes; x++) {
      // calculate changes to snowflake
      posX = this.flakes[x].x + Math.sin(this.flakes[x].yMod + this.flakes[x].y / this.radHeight * (5 - this.flakes[x].size)) * this.flakes[x].waveSize * (1 - this.flakes[x].size);
      this.flakes[x].y += this.flakes[x].size * this.fallSpeedModifier; // bigger flakes are nearer to screen, thus they fall faster to create 3d effect

      // if snowflake is out of bounds, reset
      if (this.flakes[x].y > this.height + 5) {
        this.flakes[x] = this.getRandomFlake();
      }

      // draw snowflake
      this.contextSnow.globalAlpha = (this.flakes[x].size - 1) / 3;
      this.contextSnow.drawImage(this.flake, posX, this.flakes[x].y, this.flakes[x].size, this.flakes[x].size);
    }

    // repeat 300px wide strip with snowflakes to fill whole canvas
    if (this.width > 300) {
      this.contextSnow.globalAlpha = 1;
      this.contextSnow.drawImage(this.canvasSnow, 300, 0);
      if (this.width > 600) { this.contextSnow.drawImage(this.canvasSnow, 600, 0); }
      if (this.width > 1200) { this.contextSnow.drawImage(this.canvasSnow, 1200, 0); }
      if (this.width > 2400) { this.contextSnow.drawImage(this.canvasSnow, 2400, 0); }
    }
  }

  // randomize flake data
  private getRandomFlake(init?: any) {
    return {
      x: this.range(10, 310),
      y: init ? this.range(-5, this.height + 5) : -5,
      size: Math.max(this.range(1, 4), 2),
      yMod: this.range(0, 150),
      waveSize: this.range(1, 4)
    };
  }

  // get a random number inside a range
  private range(start: number, end: number) {
    return Math.random() * (end - start) + start;
  }

  public startSnow() {
    clearInterval(this.tickHandler);
    this.tickHandler = setInterval(this.tick.bind(this), Math.floor(1000 / this.framerate));
  }
  public stopSnow() {
    const _ = this;
    clearInterval(this.tickHandler);
  }
}
