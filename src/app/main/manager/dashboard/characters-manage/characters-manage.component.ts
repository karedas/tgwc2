import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { VerifyCharacterService } from '../../services/verify-character.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { SocketService } from 'src/app/main/client/services/socket.service';
import { UsernameValidation, PasswordValidation } from 'src/app/main/common/validations';
import { Subscription, Subject } from 'rxjs';
import { takeUntil, delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ethnicity } from 'src/assets/data/ethnicity/ethnicity.const';

@Component({
  selector: 'tg-characters-manage',
  templateUrl: './characters-manage.component.html',
  providers: [VerifyCharacterService],
  encapsulation: ViewEncapsulation.None
})
export class CharactersManageComponent implements OnInit {

  @Input('chars') chars: any[];
  
  readonly env = environment;
  readonly ethnicity = ethnicity;
  readonly maxCharacter: number = 2;

  verifyCharacterForm: FormGroup;
  verifySubscription: Subscription;
  verifyFormSubmitted: boolean = false;
  apiError: boolean = false;

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private formBuilder: FormBuilder, 
    private verifyCharacterService: VerifyCharacterService,
  ) { 
    this._unsubscribeAll = new Subject<any>();
  }

  ngOnInit() {

    this.verifyCharacterForm = new FormGroup({
      characterName: new FormControl('karedas', UsernameValidation),
      characterPassword: new FormControl('peppe', PasswordValidation),
    });
    // this.verifyCharacterService
  }

  get characterUsername() {
    return this.verifyCharacterForm.get('characterName')
  }

  get characterPassword() {
    return this.verifyCharacterForm.get('characterPassword')
  }

  public verify() {
    if (this.verifyCharacterForm.invalid) {
      return;
    }

    this.verifyFormSubmitted = true;
    this.verifyCharacterForm.disable();
    
    const values = this.verifyCharacterForm.value;

    this.verifyCharacterService.check(values)
      .pipe(
        delay(2000),
        takeUntil(this._unsubscribeAll)
        )
        .subscribe(( resposne: boolean ) => {
          this.verifyFormSubmitted = false;
          this.verifyCharacterForm.enable();

          if(resposne) {
            // Adding and Rrefresh chars List
          } else {
            // Not found
          }
      });
    return;
  }
}
