import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material';
import { StepFirstComponent } from './step-first/step-first.component';
import { StepThirdComponent } from './step-third/step-third.component';
import { StepSecondComponent } from './step-second/step-second.component';
import { StepFourComponent, attributes } from './step-four/step-four.component';
import { StepFiveComponent } from './step-five/step-five.component';
import { StepSixComponent } from './step-six/step-six.component';
import { RegistrationData } from './models/creation_data.model';
import { RegistrationService } from './services/registration.service';
import { Router, NavigationExtras } from '@angular/router';


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

  data: RegistrationData = new RegistrationData();

  lastStepCompleted: boolean = false;
  registrationDone: boolean = false;
  

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
    return this.stepFourComponent ? this.stepFourComponent.frmStepFour : null;
  }

  get frmStepFive() {
    return this.stepFiveComponent ? this.stepFiveComponent.frmStepFive : null;
  }

  get frmStepSix() {
    return this.stepSixComponent ? this.stepSixComponent.frmStepSix : null;
  }

  constructor(
    private registrationService: RegistrationService,
    private router: Router
  ) { 
  }

  ngOnInit() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
          name: 'karedas',
          race: 'umano',
          start: 'Aral Maktar'
      }
  };

    this.router.navigate(['/summary'], navigationExtras);

    this.registrationService.isCreated()
      .subscribe((s) => {
        //Go to Complete
        //Show Welcome Message
      })

    /* Race */
    this.stepFirstComponent.frmStepFirst.valueChanges
      .subscribe((selected) => {
        this.frmStepSecond.reset();
        this.data.race = selected.race;
      });

    /* Ethnicity */
    this.stepSecondComponent.frmStepSecond.valueChanges
      .subscribe((selected) => {
        this.frmStepThird.reset();
        this.data.race_code = selected.race_code;
      });
  
    /* Culture */
    this.stepThirdComponent.frmStepThird.valueChanges
      .subscribe((selected) => {
        this.frmStepFour.reset(attributes);
        this.data.culture = selected.culture;
      });

    /* Skills */
    this.stepFourComponent.frmStepFour.valueChanges
      .subscribe((selected) => {
        this.frmStepFive.reset({start: 'temperia'});
        this.data.stats = selected;
      });
      
    //City Start
    this.stepFiveComponent.frmStepFive.valueChanges
      .subscribe((selected) => {
        this.data.start = selected.start;
      });
      
    //Generic
    this.stepSixComponent.frmStepSix.valueChanges
      .subscribe((selected) => {
        this.data.name = selected.name;
        this.data.sex = selected.sex;
        this.data.email = selected.email;
        this.data.password = selected.password;
      });
  }

  nextStep(event: any) {
    this.stepper.next();
  }

  onLastStepCompleted(event) {
    if(event && this.verifyForms) {
      this.registrationService.register(this.data);
    }
  }

  verifyForms(): boolean {
    if(
      this.frmStepFirst.valid &&
      this.frmStepSecond.valid &&
      this.frmStepThird.valid &&
      this.frmStepFour.valid &&
      this.frmStepFive.valid &&
      this.frmStepSix.valid
      ) {
        return true;
      } else {
        return false;
      }
  }
}
