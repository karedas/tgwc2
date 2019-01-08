import { Component, HostListener } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { Store, select } from '@ngrx/store';
import { DataState } from 'src/app/store/state/data.state';
import { getUserLevel, getDoors } from 'src/app/store/selectors';

@Component({
  selector: 'tg-directions',
  templateUrl: './directions.component.html',
  styleUrls: ['./directions.component.scss'],
})
export class DirectionsComponent {


  dirCmd: string;
  doorsStyle: any[] = [];

  private dirNames: string[] = ['nord', 'est', 'sud', 'ovest', 'alto', 'basso'];
  private dirStatus: string[] = ['00000'];

  userlevel: number = 0;

  constructor(
    private gameService: GameService,
    private store: Store<DataState>
  ) {


    this.store
      .pipe(select(getDoors))
      .subscribe(door => this.setDoors(door))

    this.store
      .pipe(select(getUserLevel))
      .subscribe(level => {
        this.userlevel = level;
      })


  }
  goToDirection($event, dir: number): void {

    $event.preventDefault();


    if (this.userlevel == 0 && this.dirStatus[dir] == '3') {
      this.dirCmd = `apri ${this.dirNames[dir]}`;
    } else if (this.userlevel == 0 && this.dirStatus[dir] == '4') {
      this.dirCmd = 'sblocca ' + this.dirNames[dir]
    } else {
      this.dirCmd = this.dirNames[dir];
    }
    if (this.dirCmd) {
      this.gameService.sendToServer(this.dirCmd);
    }
  }

  setDoors(doors: any): void {
    for (let d = 0; d < this.dirNames.length; ++d) {
      this.doorsStyle[this.dirNames[d]] = {
        'background-position': (-26 * doors[d] + 'px center')
      }
    }
    this.dirStatus = doors;
  }

  @HostListener("window:keydown", ['$event'])
  onkeydown(event: KeyboardEvent) {
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
