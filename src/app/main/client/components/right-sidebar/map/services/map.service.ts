import { Injectable, ElementRef } from '@angular/core';
import { MapSnowService } from './map-snow.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { terrainsHasShadow, terrainsCastShadow } from './map.constant';
export const images_path = './assets/images/';

// Load assets then start to draw
const tileGraphicsToLoad = [
  'tiles.png',
  'mapobj/shadowtile.png',
  'mapobj/shadow1.png',
  'mapobj/shadow2.png',
  'mapobj/shadow3.png'
];

@Injectable()
export class MapService extends MapSnowService {
  private mapObject: ElementRef;

  public cx: CanvasRenderingContext2D;
  private layerMap: any[][];

  _showSnow: BehaviorSubject<boolean> = new BehaviorSubject(false);
  _showRain: BehaviorSubject<boolean> = new BehaviorSubject(false);
  _showFog: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private readonly mapTileWidth = 32;
  private readonly mapTileHeight = 32;
  private readonly xTotalTiles = 9;
  private readonly yTotalTiles = 9;

  private tileImage: HTMLImageElement[] = [];
  private canvasWidth: number;
  private canvasHeight: number;
  private mapTileImg: HTMLImageElement;
  private mapShadowImg: HTMLImageElement[] = [];
  private mapShadowTile: HTMLImageElement;
  private canvasShadowGradient: CanvasGradient;

  private setGradients() {
    this.canvasShadowGradient = this.cx.createLinearGradient(0, 0, 0, 18);
    this.canvasShadowGradient.addColorStop(0, 'rgba(0, 0, 0, .4)');
    this.canvasShadowGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.2)');
    this.canvasShadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
  }

  public prepareCanvas(map: ElementRef): void {
    this.layerMap = new Array(this.xTotalTiles);
    for (let y = 0; y < this.xTotalTiles; ++y) {
      this.layerMap[y] = new Array(this.yTotalTiles);
    }

    this.mapTileImg = new Image();
    this.mapTileImg.src = images_path + 'tiles.png';
    // this.mapTileImg

    this.mapShadowImg[2] = new Image();
    this.mapShadowImg[2].src = images_path + 'mapobj/shadow1.png';

    this.mapShadowImg[1] = new Image();
    this.mapShadowImg[1].src = images_path + 'mapobj/shadow2.png';

    this.mapShadowImg[0] = new Image();
    this.mapShadowImg[0].src = images_path + 'mapobj/shadow3.png';

    this.mapShadowImg[0] = new Image();
    this.mapShadowImg[0].src = images_path + 'mapobj/shadow3.png';

    this.mapShadowTile = new Image();
    this.mapShadowTile.src = images_path + 'mapobj/shadowtile.png';

    for (let i = 0; i < tileGraphicsToLoad.length; i++) {
      this.tileImage[i] = new Image();
      this.tileImage[i].src = '/assets/images/' + tileGraphicsToLoad[i];
    }

    this.mapObject = map;

    this.cx = (this.mapObject.nativeElement as HTMLCanvasElement).getContext('2d');
    this.canvasWidth = this.yTotalTiles * this.mapTileWidth;
    this.canvasHeight = this.xTotalTiles * this.mapTileHeight;

    this.setGradients();

    this.cx.save();
    this.cx.beginPath();
    this.cx.arc(this.canvasWidth / 2, this.canvasHeight / 2, this.canvasWidth / 2, 0, Math.PI * 2, true);
    this.cx.clip();
    this.cx.fill();


  }

  public updateMap(dataMap: any): void {
    this.drawCanvasMap(dataMap);
    this.addEnvironmentCanvas(dataMap);
  }

  public drawCanvasMap(dataMap: any): void {
    const xoff: number = (this.xTotalTiles - dataMap.d) / 2;
    const yoff: number = (this.yTotalTiles - dataMap.d) / 2;
    const xlim = xoff + dataMap.d;
    const ylim = yoff + dataMap.d;
    // Clear the Canvas
    this.cx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    /* Cycle on every layers */
    // for(let layer = 59; layer < 2; layer++) {
    for (let layer = 0; layer < dataMap.data.length; layer++) {
      let idx = 0;
      for (let yAxis = 0; yAxis < this.xTotalTiles; yAxis++) {
        for (let xAxis = 0; xAxis < this.yTotalTiles; xAxis++) {
          if (xAxis >= xoff && xAxis < xlim && yAxis >= yoff && yAxis < ylim) {
            this.layerMap[yAxis][xAxis] = dataMap.data[layer][idx++];
          } else {
            this.layerMap[yAxis][xAxis] = 59;
          }
        }
      }

      this.drawTiles();
      if (layer === 0) {
        this.drawShadowBlackTile();
      }
    }
  }

  private drawTiles() {
    for (let y = 0; y < this.xTotalTiles; y++) {
      for (let x = 0; x < this.yTotalTiles; x++) {
        const tilenum = this.layerMap[y][x];
        if (tilenum !== 59) {
          const tpos = this.tileCoords(tilenum);
          this.cx.drawImage(
            this.tileImage[0],
            tpos[0],
            tpos[1],
            this.mapTileWidth,
            this.mapTileHeight,
            x * this.mapTileWidth,
            y * this.mapTileHeight,
            this.mapTileWidth,
            this.mapTileHeight
          );
        }
      }
    }
  }

  private hasShadow(tilenum: number): boolean {
    return terrainsHasShadow.includes(tilenum);
  }

  private castShadow(tilenum) {
    return terrainsCastShadow.includes(tilenum);
  }

  private drawShadowBlackTile() {
    for (let yAxis = 0; yAxis < this.xTotalTiles; yAxis++) {
      for (let xAxis = 0; xAxis < this.yTotalTiles; xAxis++) {
        if (this.layerMap[yAxis][xAxis] === 59) {
          let clipx = 0,
            clipy = 0,
            swidth = 48,
            sheight = 48;

          if (yAxis === 0 || this.layerMap[yAxis - 1][xAxis] === 59) {
            clipy = 8;
            sheight -= 8;
          }

          if (yAxis === this.xTotalTiles - 1 || this.layerMap[yAxis + 1][xAxis] === 59) {
            sheight -= 8;
          }

          if (xAxis === 0 || this.layerMap[yAxis][xAxis - 1] === 59) {
            clipx = 8;
            swidth -= 8;
          }

          if (xAxis === this.xTotalTiles - 1 || this.layerMap[yAxis][xAxis + 1] === 59) {
            swidth -= 8;
          }

          const draw_x = xAxis * this.mapTileWidth - 8 + clipx;
          const draw_y = yAxis * this.mapTileHeight - 8 + clipy;
          this.cx.drawImage(this.tileImage[1], clipx, clipy, swidth, sheight, draw_x, draw_y, swidth, sheight);
        } else {
          this.addProspectiveShadow(xAxis, yAxis);
        }
      }
    }
  }

  private addProspectiveShadow(x: number, y: number) {
    if (this.hasShadow(this.layerMap[y][x]) && this.layerMap[y - 1] !== undefined) {
      if (this.castShadow(this.layerMap[y - 1][x])) {
        this.cx.beginPath();
        this.cx.fillStyle = this.canvasShadowGradient;
        this.cx.setTransform(1, 0, 0, 1, x * this.mapTileWidth, y * this.mapTileWidth);
        this.cx.rect(0, 0, 32, 18);
        this.cx.fill();
        this.cx.setTransform(1, 0, 0, 1, 0, 0);
      }
    }
  }

  private addEnvironmentCanvas(dataMap) {
    if (this.mapShadowImg[dataMap.l]) {
      this.cx.drawImage(this.mapShadowImg[dataMap.l], 96 - 32 * dataMap.l, 96 - 32 * dataMap.l);
    }

    // Fog
    if (dataMap.f) {
      this._showFog.next(true);
    } else {
      this._showFog.next(false);
    }

    // Rain
    if (dataMap.r) {
      this._showRain.next(true);
    } else {
      this._showRain.next(false);
    }

    // Snow
    if (dataMap.s) {
      setTimeout(() => {
        this._showSnow.next(true);
        this.startSnow();
      }, 100);
    } else {
      setTimeout(() => {
        this._showSnow.next(false);
        this.stopSnow();
      }, 100);
    }
  }

  get mapSizes(): any {
    const size = {
      tileWidth: this.mapTileWidth,
      tileHeight: this.mapTileHeight,
      maxHeight: this.xTotalTiles,
      maxWidth: this.yTotalTiles
    };
    return size;
  }

  get displaySnow(): Observable<boolean> {
    return this._showSnow.asObservable();
  }

  get displayRain(): Observable<boolean> {
    return this._showRain.asObservable();
  }

  get displayFog(): Observable<boolean> {
    return this._showFog.asObservable();
  }

  private tileCoords(tilenum: number): number[] {
    const posx = 32 * (tilenum & 0x7f);
    const posy = 32 * (tilenum >> 7);
    return [posx, posy];
  }
}
