import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';


@Component({
  selector: 'tg-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})


export class RegistrationComponent implements OnInit {
  
  @ViewChild('registrationStepper') stepper: MatStepper;
  registrationGroup: FormGroup;

  constructor(
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.registrationGroup = this._formBuilder.group({

      formArray: this._formBuilder.array([
        this._formBuilder.group({
          race: ['human', Validators.required],
          sex: ['m', Validators.required]
        }),
        this._formBuilder.group({
          strength: [0, Validators.required],
          constitution: [0, Validators.required],
          size: [0, Validators.required],
          dexterity: [0, Validators.required],
          speed: [0, Validators.required],
          empathy: [0, Validators.required],
          intelligence: [0, Validators.required],
          willpower: [0, Validators.required],
        }),
        this._formBuilder.group({
          race_code: ['', Validators.required],
        }),
        this._formBuilder.group({
          start: ['', Validators.required],
        }),
        this._formBuilder.group({
          nome: ['', Validators.required, Validators.maxLength(12)],
          pwd: ['', Validators.required],
        }),
      ])

    });
    
    this.stepper.selectedIndex = 0;

    this.registrationGroup.valueChanges.subscribe((value) => console.log(value))

  }

  get formArray(): AbstractControl | null {
    return this.registrationGroup.get('formArray');
  }
  
  nextStep(event: any) {
    this.stepper.next();
  }
}
