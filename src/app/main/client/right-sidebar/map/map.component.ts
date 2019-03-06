import { Component, ElementRef, AfterViewInit, ViewChild, OnDestroy, OnInit } from '@angular/core';
import * as fromSelectors from 'src/app/store/selectors';
import { DataState } from 'src/app/store/state/data.state';
import { Store } from '@ngrx/store';
import { Observable, Subject, Subscription } from 'rxjs';
import { Map } from 'src/app/models/data/map.model';
import { GameService } from 'src/app/services/game.service';
import { takeUntil } from 'rxjs/operators';
import { MapService } from './services/map.service';


@Component({
  selector: 'tg-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})

export class MapComponent implements OnDestroy, OnInit {

  @ViewChild('map') map: ElementRef;
  @ViewChild('snow') snow: ElementRef;

  public mapSize: any;
  public showSnow: boolean;
  public showRain: boolean;
  public showFog: boolean;


  private _unsubscribeAll: Subject<any>;

  public isOnMap = false;
  public isOnWatcher = false;
  public isOnDirection: string;

  map$: Observable<Map>;

  constructor(
    private store: Store<DataState>,
    private game: GameService,
    private mapService: MapService,
  ) {

    this.map$ = this.store.select(fromSelectors.getMap);
    this.mapSize = this.mapService.mapSizes;


    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.mapService.prepareCanvas(this.map);
    this.mapService.prepareSnowCanvas(this.snow);
  
    // Rain
    this.mapService.displayRain
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((visible) => {
        this.showRain = visible;
      });
    // Snow
    this.mapService.displaySnow
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((visible) => {
        this.showSnow = visible;
      });
    // Fog
    this.mapService.displayFog
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((visible) => {
        this.showFog = visible;
      });
  
  
    setTimeout(() => {
      this.map$.pipe(
        takeUntil(this._unsubscribeAll)).subscribe(
          (map: Map) => {
            if (map !== undefined) {
              this.mapService.updateMap(map);
            }
          }
        );
    }, 100);
  }




  onMouseEvent() {
    this.isOnMap = (this.game.mouseIsOnMap = !this.game.mouseIsOnMap);
  }

  /* Watcher Eye */
  onWatcher(dir) {
    this.isOnWatcher = true;
    this.isOnDirection = dir;
  }

  leaveWatcher() {
    this.isOnWatcher = false;
    this.isOnDirection = '';
  }

  watchToDir(dir) {
    this.game.processCommands(`guarda ${dir}`);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
