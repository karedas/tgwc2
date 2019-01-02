import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';



export const images_path = '/assets/images/';



@Component({
  selector: 'tg-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements AfterViewInit {

  @ViewChild('map') map: ElementRef;
  public context: CanvasRenderingContext2D;

  private layerMap: any[][];
  private mapTileWidth = 32;
  private mapTileHeight = 32;
  private maxMapHeight: number;
  private maxMapWidth: number;
  private canvasWidth: number;
  private canvasHeight: number;
  private mapTileImg;
  private mapShadowImg: any[] = [];
  private mapShadowTile;

  constructor() {
    this.maxMapHeight = 9;
    this.maxMapWidth = 9;
  }

  ngAfterViewInit() {
    this.layerMap = new Array(this.maxMapHeight);
    for (let y = 0; y < this.maxMapHeight; ++y) {
      this.layerMap[y] = new Array(this.maxMapWidth);
    }

    this.prepareCanvas();
  }

  private prepareCanvas() {
    this.context = (<HTMLCanvasElement>this.map.nativeElement).getContext('2d');
    this.canvasWidth = this.maxMapWidth * this.mapTileWidth;
    this.canvasHeight = this.maxMapHeight * this.mapTileHeight;

    this.context.save();
    this.context.beginPath;
    this.context.arc(this.canvasWidth / 2, this.canvasHeight / 2, this.canvasWidth / 2, 0, Math.PI * 2, true);
    this.context.clip();
    this.context.fill();

    this.mapTileImg = new Image();
    this.mapTileImg.src = images_path + 'tiles/tiles.png';
    console.log(images_path + 'tiles/tiles.png');


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

  private fog() { }

  private snow() { }

  public updateMap(dataMap): void {
    this.drawCanvasMap(dataMap);
  }

  public drawCanvasMap(dataMap) {
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

      if (l == 0) {
        for (let y = 0; y < this.maxMapWidth; y++) {
          for (let x = 0; x < this.maxMapHeight; x++) {
            if (this.layerMap[y][x] == 59) {
              let clipx = 0,
                clipy = 0,
                swidth = 48,
                sheight = 48;

              if (y == 0 || this.layerMap[y - 1][x] == 59) {
                clipy = 8;
                sheight -= 8;
              }

              if (y == (this.maxMapHeight - 1) || this.layerMap[y + 1][x] == 59) {
                sheight -= 8;
              }

              if (x == 0 || this.layerMap[y][x - 1] == 59) {
                clipx = 8;
                swidth -= 8;
              }

              if (x == (this.maxMapWidth - 1) || this.layerMap[y][x + 1] == 59) {
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
    // if(map.f) {
    //  _.MAPCTX.drawImage(mapfogimg, 0, 0);
    // }
    // Rain
    // if(map.r) {
    //  _.MAPCTX.drawImage(mapfogimg, 0, 0);
    // }


    if (dataMap.s) {
      // Start Snow effect
//      this.context.snow.start();
     // $('#snowCanvas').show();
    } else {
      // Stop Snow effect
      // this.context.snow.stop();
     // $('#snowCanvas').hide();
    }
  }


  private tileCoords(tilenum: number): number[] {
    const posx = 32 * (tilenum & 0x7f);
    const posy = 32 * (tilenum >> 7);
    return [posx, posy];
  }
}
