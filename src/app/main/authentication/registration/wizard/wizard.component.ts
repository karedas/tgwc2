import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatStepper } from '@angular/material';
import { StepFirstComponent } from './step-first/step-first.component';
import { StepThirdComponent } from './step-third/step-third.component';
import { StepSecondComponent } from './step-second/step-second.component';
import { StepFourComponent } from './step-four/step-four.component';
import { StepFiveComponent } from './step-five/step-five.component';
import { StepSixComponent } from './step-six/step-six.component';
import { RegistrationService } from '../services/registration.service';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'tg-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
})



export class WizardComponent implements OnInit, OnDestroy {

  @ViewChild('registrationStepper') stepper: MatStepper;
  @ViewChild(StepFirstComponent) stepFirstComponent: StepFirstComponent;
  @ViewChild(StepSecondComponent) stepSecondComponent: StepSecondComponent;
  @ViewChild(StepThirdComponent) stepThirdComponent: StepThirdComponent;
  @ViewChild(StepFourComponent) stepFourComponent: StepFourComponent;
  @ViewChild(StepFiveComponent) stepFiveComponent: StepFiveComponent;
  @ViewChild(StepSixComponent) stepSixComponent: StepSixComponent;

  data: any;

  lastStepCompleted: boolean = false;
  verified: boolean = false;
  registrationDone: boolean = false;

  private _unsubscribeAll: Subject<any>;


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
    this.data = this.registrationService.getParams();
    this._unsubscribeAll = new Subject<any>();
  }

  ngOnInit() {

    this.stepper.selectedIndex = 0;

    this.registrationService.isCreated()
      .subscribe((res) => {
        if(res) {
          this.router.navigate(['/riepilogo']);
        }
      })


    this.registrationService.getParams()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((values) => {

        this.data = values;
      })

    /* Race */
    this.stepFirstComponent.frmStepFirst.valueChanges
      .subscribe((race) => {
        this.frmStepSecond.reset();
        this.registrationService.setParams(race);
      });

    /* Ethnicity */
    this.stepSecondComponent.frmStepSecond.valueChanges
      .subscribe((selected) => {
        this.frmStepThird.reset();
        this.registrationService.setParams(selected);
      });

    /* Culture */
    this.stepThirdComponent.frmStepThird.valueChanges
      .subscribe((selected) => {
        this.stepFourComponent.calculateUsedPoints();
        this.frmStepFour.reset({
          strength: 0,
          constitution: 0,
          size: 0,
          dexterity: 0,
          speed: 0,
          empathy: 0,
          intelligence: 0,
          willpower: 0
        });

        this.registrationService.setParams(selected);
      });

    /* Skills */
    this.stepFourComponent.frmStepFour.valueChanges
      .subscribe((selected) => {
        this.frmStepFive.reset({ start: 'temperia' });
        this.registrationService.setParams({stats: selected});
      });

    //City Start
    this.stepFiveComponent.frmStepFive.valueChanges
      .subscribe((selected) => {
        this.registrationService.setParams(selected);
      });

    //Generic
    this.stepSixComponent.frmStepSix.valueChanges
      .subscribe((selected) => {
        this.registrationService.setParams(selected);
      });
  }

  nextStep(event: any) {
    this.stepper.next();
  }

  onLastStepCompleted(event) {
    if (event && this.verifyForms) {
      this.registrationService.register(this.data);
    }
  }

  verifyForms(): boolean {
    if (
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

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();    
  }
}
