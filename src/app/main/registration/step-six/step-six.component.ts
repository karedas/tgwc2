import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SocketService } from 'src/app/services/socket.service';
import { RegistrationService } from '../services/registration.service';

@Component({
  selector: 'tg-step-six',
  templateUrl: './step-six.component.html',
  styleUrls: ['./step-six.component.scss']
})
export class StepSixComponent implements OnInit {


  frmStepSix: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private registrationService: RegistrationService,
    private socketService: SocketService) {

    this.frmStepSix = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(16),
        Validators.pattern(/^[A-Za-z]+$/)
      ]],
      sex: ['m'],
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^[a-z0-9]+$/i)]],
      confirmPassword: ['', Validators.required]
    },
      {
        validator: [
          this.mustMatch('password', 'confirmPassword'),
          this.mustMatch('email', 'confirmEmail')
        ]
      }
    );
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {

      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      
      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }
      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  test() {

  
    let create = "create:" 
    + "testoryondue,"
    + "pwdtest,"
    + "lisandr84@gmail.com,"
    + "123456789,"
    + "ume,"
    + "m,"
    + "minatore,"
    + "temperia,"
    + "20,"
    + "20,"
    + "20,"
    + "-20,"
    + "-20,"
    + "-20,"
    + "-15,"
    + "0"
    + "\n";

    this.registrationService.test(create);
  }

  ngOnInit() {
  }
}