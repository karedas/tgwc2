import { Component, OnDestroy,  OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
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
  
  characters: any;
  enabledCharactersNumber: number;
  
  private _unsubscribeAll: Subject<any>;

  constructor(private userService: UserService) {
    this._unsubscribeAll = new Subject();
    this.characters = this.userService.getCharacters();
  }
  
  
  ngOnInit(): void {
    // this.characters.subscribe()
      // .subscribe( chars => { 
      //   this.characters = chars;
      //   this.enabledCharactersNumber = this.getTotalEnabledChars();
      // });
  }
  
  // private getTotalEnabledChars(): number {
  //   let count = 0;
  //   for(let i = 0; i < this.characters.length; ++i){
  //     if(this.characters[i].status === 'enable')
  //       count++;
  //   }
  //   return count;
  // }

  
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
