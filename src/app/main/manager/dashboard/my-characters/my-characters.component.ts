import { Component, OnDestroy,  OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/core/services/user.service';
import { ethnicity } from 'src/assets/data/ethnicity/ethnicity.const';


@Component({
  selector: 'tg-my-characters',
  templateUrl: './my-characters.component.html',
  styleUrls: ['./my-characters.component.scss'],
})
export class MyCharactersComponent implements OnInit,  OnDestroy{

  readonly env = environment;
  readonly maxCharacter = 2;
  readonly ethnicity = ethnicity;
  
  characters: any;
  enabledCharactersNumber: number;
  
  private _unsubscribeAll: Subject<any>;

  constructor(private userService: UserService) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.userService.getCharacters()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(( response: any ) => { 
        this.characters = response.chars;
        this.enabledCharactersNumber = this.getTotalEnabledChars();
      });
  }
  
  getTotalEnabledChars(): number {
    let count = 0;
    for(let i = 0; i < this.characters.length; ++i){
      if(this.characters[i].status === 'enable')
        count++;
    }
    return count;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
