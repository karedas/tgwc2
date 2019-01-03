import { Component } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { Store, select } from '@ngrx/store';
import { DataState } from 'src/app/store/state/data.state';
import { getUserLevel } from 'src/app/store/selectors';

@Component({
  selector: 'tg-directions',
  templateUrl: './directions.component.html',
  styleUrls: ['./directions.component.scss'],
})
export class DirectionsComponent {

  private isHoverMap: boolean;
  
  dirCmd: string;

  private dirNames: string[] = ['nord', 'est', 'sud', 'ovest', 'alto', 'basso'];
  private dirStatus: string[] = ['00000'];

  userlevel: number = 0;

  constructor(
    private gameService: GameService,
    private store: Store<DataState>
  ) {

    this.store
      .pipe(select(getUserLevel))
      .subscribe(level => {
        this.userlevel = level;
      })

  }
  goToDirection($event, dir: number): void {
    console.log($event, dir);

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

}
