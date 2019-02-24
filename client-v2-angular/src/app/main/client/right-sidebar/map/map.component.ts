import { Component, ElementRef, AfterViewInit, ViewChild, OnDestroy, Input, ChangeDetectionStrategy } from '@angular/core';
import * as fromSelectors from 'src/app/store/selectors';
import { DataState } from 'src/app/store/state/data.state';
import { Store } from '@ngrx/store';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Map } from 'src/app/models/data/map.model';
import { takeUntil, delay } from 'rxjs/operators';
import { MapSnowService } from './map-snow.service';



export const images_path = './assets/images/';

@Component({
  selector: 'tg-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})

export class MapComponent implements OnDestroy, AfterViewInit {

  @ViewChild('map') map: ElementRef;
  @ViewChild('snow') snow: ElementRef;


  private _unsubscribeAll: Subject<any>;
  isOnMap = false;

  map$: Observable<Map>;
  public context: CanvasRenderingContext2D;
  private layerMap: any[][];

  mapTileWidth: number;
  mapTileHeight: number;
  maxMapHeight: number;
  maxMapWidth: number;

  private canvasWidth: number;
  private canvasHeight: number;
  private mapTileImg: HTMLImageElement;
  private mapShadowImg: HTMLImageElement[] = [];
  private mapShadowTile: HTMLImageElement;

  showSnow: boolean;
  showRain: boolean;
  showFog: boolean;

  constructor(
    private store: Store<DataState>,
    private mapSnowService: MapSnowService
  ) {
    this.mapTileWidth = 32;
    this.mapTileHeight = 32;
    this.maxMapHeight = 9;
    this.maxMapWidth = 9;


    this.map$ = this.store.select(fromSelectors.getMap);

    this._unsubscribeAll = new Subject();

  }

  onMouseEvent($event) {
    this.isOnMap = !this.isOnMap;
  }

  ngAfterViewInit() {


    this.layerMap = new Array(this.maxMapHeight);
    for (let y = 0; y < this.maxMapHeight; ++y) {
      this.layerMap[y] = new Array(this.maxMapWidth);
    }

    this.prepareCanvas();

    this.map$.pipe(
      delay(100),
      takeUntil(this._unsubscribeAll)).subscribe(
      (map: Map) => {
        if (map !== undefined) {
          this.updateMap(map);
        }
      }
    );
  }

  private prepareCanvas(): void {
    this.context = (<HTMLCanvasElement>this.map.nativeElement).getContext('2d');
    this.canvasWidth = this.maxMapWidth * this.mapTileWidth;
    this.canvasHeight = this.maxMapHeight * this.mapTileHeight;

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


    this.mapSnowService.make(this.snow);


  }

  public updateMap(dataMap): void {
    this.drawCanvasMap(dataMap);
  }

  public drawCanvasMap(dataMap): void {
    const _ = this;

    let xoff, yoff, xlim, ylim, light;
    // clip options
    const radius = 75;
    const offset = 0;

    xoff = (this.maxMapWidth - dataMap.d) / 2;
    yoff = (this.maxMapHeight - dataMap.d) / 2;
    xlim = xoff + dataMap.d;
    ylim = yoff + dataMap.d;

    // Clear the Canvas
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    /* Cycle on the 2 layers */
    for (let l = 0; l < 2; l++) {
      let pos = 0;
      for (let y = 0; y < this.maxMapWidth; y++) {
        for (let x = 0; x < this.maxMapHeight; x++) {
          if (x >= xoff && x < xlim && y >= yoff && y < ylim) {
            this.layerMap[y][x] = dataMap.data[l][pos++];
          } else {
            this.layerMap[y][x] = 59;
          }
        }
      }

      for (let y = 0; y < this.maxMapWidth; y++) {
        for (let x = 0; x < this.maxMapHeight; x++) {
          const d = this.layerMap[y][x];
          if (d != 59) {
            const tpos = this.tileCoords(d);

            // Clip inside circle then draw.
            this.context.drawImage(
              this.mapTileImg,
              tpos[0],
              tpos[1],
              this.mapTileWidth,
              this.mapTileWidth,
              x * this.mapTileWidth,
              y * this.mapTileHeight,
              this.mapTileWidth,
              this.mapTileHeight);
          }
        }
      }

      if (l === 0) {
        for (let y = 0; y < this.maxMapWidth; y++) {
          for (let x = 0; x < this.maxMapHeight; x++) {
            if (this.layerMap[y][x] === 59) {
              let clipx = 0,
                clipy = 0,
                swidth = 48,
                sheight = 48;

              if (y === 0 || this.layerMap[y - 1][x] === 59) {
                clipy = 8;
                sheight -= 8;
              }

              if (y === (this.maxMapHeight - 1) || this.layerMap[y + 1][x] === 59) {
                sheight -= 8;
              }

              if (x === 0 || this.layerMap[y][x - 1] === 59) {
                clipx = 8;
                swidth -= 8;
              }

              if (x === (this.maxMapWidth - 1) || this.layerMap[y][x + 1] === 59) {
                swidth -= 8;
              }
              this.context.drawImage(this.mapShadowTile, clipx, clipy, swidth, sheight, x * this.mapTileWidth - 8 + clipx, y * this.mapTileHeight - 8 + clipy, swidth, sheight);
            }
          }
        }
      }
    }

    if (this.mapShadowImg[dataMap.l]) {
      this.context.drawImage(this.mapShadowImg[dataMap.l], 96 - 32 * dataMap.l, 96 - 32 * dataMap.l);
    }

    // Fog
    if(dataMap.f) {
      this.showFog = true;
    } else {
      this.showFog = false;
    }

    // Rain
    if(dataMap.r) {
      this.showRain = true;
    } else {
      this.showRain = false;
    }

    if (dataMap.s) {
      setTimeout(() => {
        // Start Snow effect
        this.showSnow = true;
        this.mapSnowService.start();
      }, 100);
    } else {
      setTimeout(() => {
        // Stop Snow effect
        this.showSnow = false;
        this.mapSnowService.stop();
      }, 100);
    }
  }



  private tileCoords(tilenum: number): number[] {
    const posx = 32 * (tilenum & 0x7f);
    const posy = 32 * (tilenum >> 7);
    return [posx, posy];
  }



  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
