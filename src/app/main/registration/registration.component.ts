import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StepFirstComponent } from './step-first/step-first.component';
import { StepThirdComponent } from './step-third/step-third.component';
import { StepSecondComponent } from './step-second/step-second.component';
import { StepFourComponent } from './step-four/step-four.component';
import { StepFiveComponent } from './step-five/step-five.component';
import { StepSixComponent } from './step-six/step-six.component';
import { RegistrationData } from './models/creation_data.model';


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
  @ViewChild(StepFourComponent) stepFourComponent: StepFourComponent;
  @ViewChild(StepFiveComponent) stepFiveComponent: StepFiveComponent;
  @ViewChild(StepSixComponent) stepSixComponent: StepSixComponent;


  race: string;
  race_code: string;

  data: RegistrationData = new RegistrationData();



  get frmStepFirst() {
    return this.stepFirstComponent ? this.stepFirstComponent.frmStepFirst : null;
  }

  get frmStepSecond() {
    return this.stepSecondComponent ? this.stepSecondComponent.frmStepSecond : null;
  }

  get frmStepThird() {
    return this.stepThirdComponent ? this.stepThirdComponent.frmStepThird : null;
  }

  get frmStepFour() {
    return this.stepThirdComponent ? this.stepThirdComponent.frmStepThird : null;
  }

  get frmStepFive() {
    return this.stepThirdComponent ? this.stepThirdComponent.frmStepThird : null;
  }

  get frmStepSix() {
    return this.stepThirdComponent ? this.stepThirdComponent.frmStepThird : null;
  }

  constructor() { }


  ngOnInit() {
    this.stepper.selectedIndex = 5;

    //Race
    this.stepFirstComponent.frmStepFirst.valueChanges
      .subscribe((selected) => {
        this.data.race = selected.race;
        //Todo??
        this.stepSecondComponent.race_code = null;
        //DEBUG:
        console.log(selected);
      });

    //Ethnicity
    this.stepSecondComponent.frmStepSecond.valueChanges
      .subscribe((selected) => {
        this.data.race_code = selected.race_code;
        //DEBUG:
        console.log(selected);
      });

    //Culture
    this.stepThirdComponent.frmStepThird.valueChanges
      .subscribe((selected) => {
        //DEBUG:
        console.log(selected);
      });

    //Skills
    this.stepFourComponent.frmStepFour.valueChanges
      .subscribe((selected) => {
        //DEBUG:
        console.log(selected);
      });
      
    //Skills
    this.stepFiveComponent.frmStepFive.valueChanges
      .subscribe((selected) => {
        //DEBUG:
        console.log(selected);
      });
      
    //Skills
    this.stepSixComponent.frmStepSix.valueChanges
      .subscribe((selected) => {
        //DEBUG:
        console.log(selected);
      });


  }

  nextStep(event: any) {
    this.stepper.next();
  }
}
