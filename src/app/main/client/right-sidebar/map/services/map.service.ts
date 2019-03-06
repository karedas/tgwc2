import { Injectable, ElementRef } from '@angular/core';
import { MapSnowService } from './map-snow.service';
import { BehaviorSubject, Observable } from 'rxjs';
export const images_path = './assets/images/';

@Injectable({
  providedIn: 'root'
})

export class MapService extends MapSnowService {

  private mapObject: ElementRef;

  public context: CanvasRenderingContext2D;
  private layerMap: any[][];

  _mapTileWidth: number = 32;
  _mapTileHeight: number = 32;
  _maxMapHeight: number = 9;
  _maxMapWidth: number = 9;

  _showSnow: BehaviorSubject<boolean> = new BehaviorSubject(false);
  _showRain: BehaviorSubject<boolean> = new BehaviorSubject(false);
  _showFog: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private canvasWidth: number;
  private canvasHeight: number;
  private mapTileImg: HTMLImageElement;
  private mapShadowImg: HTMLImageElement[] = [];
  private mapShadowTile: HTMLImageElement;


  public prepareCanvas(map: ElementRef): void {

    this.layerMap = new Array(this._maxMapHeight);
    for (let y = 0; y < this._maxMapHeight; ++y) {
      this.layerMap[y] = new Array(this._maxMapWidth);
    }

    this.mapObject = map;

    this.context = (<HTMLCanvasElement>this.mapObject.nativeElement).getContext('2d');
    this.canvasWidth = this._maxMapWidth * this._mapTileWidth;
    this.canvasHeight = this._maxMapHeight * this._mapTileHeight;

    this.context.save();
    this.context.beginPath;
    this.context.arc(this.canvasWidth / 2, this.canvasHeight / 2, this.canvasWidth / 2, 0, Math.PI * 2, true);
    this.context.clip();
    this.context.fill();

    this.mapTileImg = new Image();
    this.mapTileImg.src = images_path + 'tiles.png';

    this.mapShadowImg[2] = new Image();
    this.mapShadowImg[2].src = images_path + 'interface/shadow1.png';

    this.mapShadowImg[1] = new Image();
    this.mapShadowImg[1].src = images_path + 'interface/shadow2.png';

    this.mapShadowImg[0] = new Image();
    this.mapShadowImg[0].src = images_path + 'interface/shadow3.png';

    this.mapShadowImg[0] = new Image();
    this.mapShadowImg[0].src = images_path + 'interface/shadow3.png';

    this.mapShadowTile = new Image();
    this.mapShadowTile.src = images_path + 'interface/shadowtile.png';
  }

  public updateMap(dataMap: any): void {
    this.drawCanvasMap(dataMap);
  }

  public drawCanvasMap(dataMap: any): void {
    const _ = this;

    let xoff: number, yoff: number, xlim: number, ylim: number;
    // clip options

    xoff = (this._maxMapWidth - dataMap.d) / 2;
    yoff = (this._maxMapHeight - dataMap.d) / 2;
    xlim = xoff + dataMap.d;
    ylim = yoff + dataMap.d;

    // Clear the Canvas
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    /* Cycle on the 2 layers */
    for (let l = 0; l < 2; l++) {
      let pos = 0;
      for (let y = 0; y < this._maxMapWidth; y++) {
        for (let x = 0; x < this._maxMapHeight; x++) {
          if (x >= xoff && x < xlim && y >= yoff && y < ylim) {
            this.layerMap[y][x] = dataMap.data[l][pos++];
          } else {
            this.layerMap[y][x] = 59;
          }
        }
      }

      for (let y = 0; y < this._maxMapWidth; y++) {
        for (let x = 0; x < this._maxMapHeight; x++) {
          const d = this.layerMap[y][x];
          if (d !== 59) {
            const tpos = this.tileCoords(d);
            // Clip inside circle then draw.
            this.context.drawImage(
              this.mapTileImg,
              tpos[0],
              tpos[1],
              this._mapTileWidth,
              this._mapTileWidth,
              x * this._mapTileWidth,
              y * this._mapTileHeight,
              this._mapTileWidth,
              this._mapTileHeight);
          }
        }
      }

      if (l === 0) {
        for (let y = 0; y < this._maxMapWidth; y++) {
          for (let x = 0; x < this._maxMapHeight; x++) {
            if (this.layerMap[y][x] === 59) {
              let clipx = 0,
                clipy = 0,
                swidth = 48,
                sheight = 48;

              if (y === 0 || this.layerMap[y - 1][x] === 59) {
                clipy = 8;
                sheight -= 8;
              }

              if (y === (this._maxMapHeight - 1) || this.layerMap[y + 1][x] === 59) {
                sheight -= 8;
              }

              if (x === 0 || this.layerMap[y][x - 1] === 59) {
                clipx = 8;
                swidth -= 8;
              }

              if (x === (this._maxMapWidth - 1) || this.layerMap[y][x + 1] === 59) {
                swidth -= 8;
              }

              this.context.drawImage(this.mapShadowTile, clipx, clipy, swidth, sheight, x * this._mapTileWidth - 8 + clipx, y * this._mapTileHeight - 8 + clipy, swidth, sheight);
            }
          }
        }
      }
    }

    if (this.mapShadowImg[dataMap.l]) {
      this.context.drawImage(this.mapShadowImg[dataMap.l], 96 - 32 * dataMap.l, 96 - 32 * dataMap.l);
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

    if (dataMap.s) {
      setTimeout(() => {
        // Start Snow effect
        this._showSnow.next(true);
        this.startSnow();
      }, 100);
    } else {
      setTimeout(() => {
        // Stop Snow effect
        this._showSnow.next(false);
        this.stopSnow();
      }, 100);
    }
  }

  get mapSizes(): any {
     const size = {
       tileWidth: this._mapTileWidth,
       tileHeight: this._mapTileHeight,
       maxHeight: this._maxMapHeight,
       maxWidth: this._maxMapWidth
     }
    return size;
  }

  get displaySnow(): Observable<boolean>  {
    return this._showSnow.asObservable();
  }

  get displayRain(): Observable<boolean>  {
    return this._showRain.asObservable();
  }

  get displayFog(): Observable<boolean>  {
    return this._showFog.asObservable();
  }

  private tileCoords(tilenum: number): number[] {
    const posx = 32 * (tilenum & 0x7f);
    const posy = 32 * (tilenum >> 7);
    return [posx, posy];
  }


}
