import { Component, OnDestroy,  OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/core/services/user.service';
import { ethnicity } from 'src/assets/data/ethnicity/ethnicity.const';


@Component({
  selector: 'tg-my-characters',
  templateUrl: './my-characters.component.html',
  styleUrls: ['./my-characters.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MyCharactersComponent implements OnInit,  OnDestroy{

  readonly env = environment;
  readonly maxCharacter = 2;
  readonly ethnicity = ethnicity;

  characters: Observable<any>;
  test: Observable<any>;
  enabledCharactersNumber: number;
  
  private _unsubscribeAll: Subject<any>;

  constructor(private userService: UserService) {
    this._unsubscribeAll = new Subject();
  }
  
  
  ngOnInit(): void {
    this.characters = this.userService.characters;

    // this.characters = this.userService.characters;
    // this.characters
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe((chars: any) => { 
    //     this.enabledCharactersNumber = this.getTotalEnabledChars(chars);
    //   });
  }
  
  private getTotalEnabledChars(chars: any): number {
    let count = 0;
    for(let i = 0; i < chars.length; ++i){
      if(chars[i].status === 'enable')
        count++;
    }
    return count;
  }
  
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
