import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { VerifyCharacterService } from '../../services/verify-character.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { SocketService } from 'src/app/main/client/services/socket.service';
import { UsernameValidation, PasswordValidation } from 'src/app/main/common/validations';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tg-characters-manage',
  templateUrl: './characters-manage.component.html',
  styleUrls: ['./characters-manage.component.scss'],
  providers: [VerifyCharacterService],
  encapsulation: ViewEncapsulation.None
})
export class CharactersManageComponent implements OnInit {

  verifyCharacterForm: FormGroup;
  verifySubscription: Subscription;

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private formBuilder: FormBuilder, 
    private verifyCharacterService: VerifyCharacterService,
  ) { }

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

    const values = this.verifyCharacterForm.value;

    this.verifyCharacterService.check(values)
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe( (verifyResponse: boolean ) => {
    //     if(verifyResponse) {

    //     }
    //   });

    return;

  }



}
