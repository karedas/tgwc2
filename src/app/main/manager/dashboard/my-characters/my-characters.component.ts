import { Component, OnDestroy, AfterViewInit, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiResponse } from 'src/app/core/models/api-response.model';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'tg-my-characters',
  templateUrl: './my-characters.component.html',
  styleUrls: ['./my-characters.component.scss'],
})
export class MyCharactersComponent implements OnInit,  OnDestroy{

  characters: any;
  charactersSizeMax: number = 2;
  
  private _unsubscribeAll: Subject<any>;

  constructor(private dashboardService: DashboardService) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

    this.dashboardService.onCharactersListChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(( response: ApiResponse ) => { 
        this.characters = response.data.chars;
        this.charactersSizeMax = this.characters.length;

      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
