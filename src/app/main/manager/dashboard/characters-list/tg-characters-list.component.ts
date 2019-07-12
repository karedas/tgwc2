import { Component, ViewEncapsulation, Output, EventEmitter, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ethnicity } from 'src/assets/data/ethnicity/ethnicity.const';
import { UserService } from 'src/app/core/services/user.service';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Character } from 'src/app/core/models/character.model';
import { LoginClientService } from 'src/app/main/client/services/login-client.service';
import { NGXLogger } from 'ngx-logger';


@Component({
  selector: 'tg-characters-list',
  templateUrl: './tg-characters-list.component.html',
  encapsulation: ViewEncapsulation.None
})
export class MyCharactersComponent implements OnInit {

  @Output() goToManage = new EventEmitter();
  // @Input() chars: any[];

  readonly env = environment;
  readonly ethnicity = ethnicity;
  readonly maxCharacter: number;

  charactersList: Observable<any>;
  enabledCharactersNumber: number;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private userService: UserService,
    private loginClientService: LoginClientService,
    private logger: NGXLogger
  ) {
    this._unsubscribeAll = new Subject<any>();
  }
  
  ngOnInit() {    
    this.charactersList = this.userService.getCharacters()
      .pipe(
        map((char: Character) => {
          return char.filter(char => char.status === 1);
        })
      );
  }

  loginCharacter ( name: string ) {

    const data = {name: name, secret: 'peppe'}
    this.loginClientService.login(data)
      .pipe(
        takeUntil(this._unsubscribeAll)
      )
      .subscribe();
  }

  // private getTotalEnabledChars(chars: any): number {

  //   if (!chars)
  //     return;

  //   let count = 0;

  //   for (let i = 0; i < chars.length; ++i) {
  //     if (chars[i].status === 1)
  //       count++;
  //   }

  //   return count;
  // }

  goToChractersManage(event) {
    this.goToManage.emit();
  }
}
