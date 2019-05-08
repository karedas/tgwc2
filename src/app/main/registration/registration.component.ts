import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StepFirstComponent } from './step-first/step-first.component';
import { StepThirdComponent } from './step-third/step-third.component';
import { StepSecondComponent } from './step-second/step-second.component';


@Component({
  selector: 'tg-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})


export class RegistrationComponent implements OnInit {

  @ViewChild('registrationStepper') stepper: MatStepper;
  @ViewChild(StepFirstComponent) stepFirstComponent: StepFirstComponent;
  @ViewChild(StepSecondComponent) stepSecondComponent: StepSecondComponent;
  @ViewChild(StepThirdComponent) stepThirdComponent: StepThirdComponent;
 

  selectedBaseRace: string;

  get frmStepFirst() {
    return this.stepFirstComponent ? this.stepFirstComponent.frmStepFirst : null;
  }

  get frmStepSecond() {
    return this.stepSecondComponent ? this.stepSecondComponent.frmStepSecond : null;
  }
  
  get frmStepThird() {
    return this.stepThirdComponent ? this.stepThirdComponent.frmStepThird : null;
  }


  constructor(private _formBuilder: FormBuilder) { }


  ngOnInit() {

    this.stepFirstComponent.frmStepFirst.valueChanges
      .subscribe((race) => { console.log(race); this.selectedBaseRace = race });

    // this.registrationGroup = this._formBuilder.group({

    //   formArray: this._formBuilder.array([
    //     this._formBuilder.group({
    //       race: ['human', Validators.required],
    //       sex: ['m', Validators.required]
    //     }),
    //     this._formBuilder.group({
    //       strength: [0, Validators.required],
    //       constitution: [0, Validators.required],
    //       size: [0, Validators.required],
    //       dexterity: [0, Validators.required],
    //       speed: [0, Validators.required],
    //       empathy: [0, Validators.required],
    //       intelligence: [0, Validators.required],
    //       willpower: [0, Validators.required],
    //     }),
    //     this._formBuilder.group({
    //       race_code: ['', Validators.required],
    //     }),
    //     this._formBuilder.group({
    //       start: ['', Validators.required],
    //     }),
    //     this._formBuilder.group({
    //       nome: ['', Validators.required, Validators.maxLength(12)],
    //       pwd: ['', Validators.required],
    //     }),
    //   ])

    // });

    this.stepper.selectedIndex = 2;
    // this.frmStepOne.valueChanges.subscribe((value) => console.log(value))
  }

  nextStep(event: any) {
    this.stepper.next();
  }
}
