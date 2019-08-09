import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { VerifyCharacterService } from '../../services/verify-character.service';
import { FormGroup, FormControl } from '@angular/forms';
import { UsernameValidation, PasswordValidation } from 'src/app/main/common/validators/character-validations';
import { Subscription, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ethnicity } from 'src/assets/data/ethnicity/ethnicity.const';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'tg-characters-add',
  templateUrl: './characters-add.component.html',
  providers: [VerifyCharacterService],
  encapsulation: ViewEncapsulation.None
})
export class CharactersAddComponent implements OnInit {

  readonly env = environment;
  readonly ethnicity = ethnicity;
  readonly maxCharacter: number = 2;

  verifyCharacterForm: FormGroup;
  verifySubscription: Subscription;
  verifyFormSubmitted = false;
  apiError = false;

  charactersList: Observable<any>;


  // Private

  constructor(
    // private formBuilder: FormBuilder,
    // private socketService: SocketService,
    // private verifyCharacterService: VerifyCharacterService,
    private userService: UserService
  ) {
  }

  ngOnInit() {

    this.charactersList = this.userService.getCharacters();

    this.verifyCharacterForm = new FormGroup({
      characterName: new FormControl('karedas', UsernameValidation),
      characterPassword: new FormControl('peppe', PasswordValidation),
    });
  }

  get characterUsername() {
    return this.verifyCharacterForm.get('characterName');
  }

  get characterPassword() {
    return this.verifyCharacterForm.get('characterPassword');
  }

  public verify() {

    // if (this.verifyCharacterForm.invalid) {
    //   return;
    // }

    // this.verifyFormSubmitted = true;
    // this.verifyCharacterForm.disable();

    // const formData = this.verifyCharacterForm.value;

    // this.verifyCharacterService.check(formData)
    //   .pipe(
    //     delay(2000),
    //     takeUntil(this._unsubscribeAll)
    //   )
    //   .subscribe((resposne: boolean) => {
    //     this.verifyFormSubmitted = false;
    //     this.verifyCharacterForm.enable();

    //     if (resposne) {
    //       // Adding and Rrefresh chars List
    //     } else {
    //       // Not found
    //     }

    //   });


    return;
  }
}
