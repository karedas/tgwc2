import { Component, HostListener, Input, OnInit, OnDestroy } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { Store, select } from '@ngrx/store';
import { DataState } from 'src/app/store/state/data.state';
import { getDoors, getUserLevel, getInvisibilityLevel } from 'src/app/store/selectors';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tg-directions',
  templateUrl: './directions.component.html',
  styleUrls: ['./directions.component.scss'],
})

export class DirectionsComponent implements OnInit, OnDestroy {

  @Input('isOnMap') isOnMap: boolean;

  dirCmd: string;
  doorsStyle: any[] = [];
  invisibilityLevel: number;

  private dirNames: string[] = ['nord', 'est', 'sud', 'ovest', 'alto', 'basso'];
  private dirStatus: string[] = ['00000'];


  private doors$: Observable<any>;
  private invisibilityLevel$: Observable<any>;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private game: GameService,
    private store: Store<DataState>
  ) {

    this.doors$ = this.store.pipe(select(getDoors));
    this.invisibilityLevel$ = this.store.pipe(select(getInvisibilityLevel));

    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.doors$.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      door => this.setDoors(door)
    );

    this.invisibilityLevel$.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      level => { this.invisibilityLevel = level; }
    );
  }


  goToDirection(event: any, dir: number): void {

    event.preventDefault();
    event.stopImmediatePropagation();

    let cmd: string;

    // Go to Dir or open The Door with Left Click
      if (this.invisibilityLevel === 0 && this.dirStatus[dir] === '3') {
        cmd = `apri ${this.dirNames[dir]}`;
      } else if (this.invisibilityLevel === 0 && this.dirStatus[dir] === '4') {
        cmd = 'sblocca ' + this.dirNames[dir];
      } else {
        cmd = this.dirNames[dir];
      }
      if (cmd) {
        this.game.sendToServer(cmd);
      }
  }

  closeLockDoor(event: any, dir: number): boolean {

    let cmd: string;

    // Close The Door with Right Click
        if (this.dirStatus[dir] == '2') {
          cmd = `chiudi ${this.dirNames[dir]}`;
        } else if (this.dirStatus[dir] == '3') {
          cmd = `blocca ${this.dirNames[dir]}`;
        }
        if (cmd) {
          this.game.sendToServer(cmd);
        }
  
        return false;
   }
      


  setDoors(doors: any): void {
    for (let d = 0; d < this.dirNames.length; ++d) {
      this.doorsStyle[this.dirNames[d]] = {
        'background-position': (-26 * doors[d] + 'px center')
      };
    }
    this.dirStatus = doors;
  }

  @HostListener('window:keydown', ['$event'])
  onkeydown(event: KeyboardEvent) {


    if (this.isOnMap) {
      switch (event.key) {
        case 'ArrowUp':
          this.goToDirection(event, 0);
          break;
        case 'ArrowDown':
          this.goToDirection(event, 2);
          break;
        case 'ArrowLeft':
          this.goToDirection(event, 3);
          break;
        case 'ArrowRight':
          this.goToDirection(event, 1);
          break;
        case 'PageUp':
          this.goToDirection(event, 4);
          break;
        case 'PageDown':
          this.goToDirection(event, 5);
          break;
      }
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
