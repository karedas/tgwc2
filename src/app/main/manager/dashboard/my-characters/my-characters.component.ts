import { Component, OnDestroy, AfterViewInit, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiResponse } from 'src/app/core/models/api-response.model';
import { DashboardService } from '../dashboard.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'tg-my-characters',
  templateUrl: './my-characters.component.html',
  styleUrls: ['./my-characters.component.scss'],
})
export class MyCharactersComponent implements OnInit,  OnDestroy{

  readonly env = environment;
  readonly maxCharacter = 2;
  
  characters: any;
  charactersSizeMax: number = 2;
  
  private _unsubscribeAll: Subject<any>;

  constructor(private dashboardService: DashboardService) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.dashboardService.getMyCharacters()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(( response: any ) => { 
        this.characters = response.chars;
        this.charactersSizeMax = this.characters.length;
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
