import { Component, OnInit, ViewEncapsulation, ViewChild, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatStepper, MatStepperNext } from '@angular/material';


export interface ICreationData {
  name: string,
  password: string,
  email: string,
  invitation: string,
  race: string,
  sex: string,
  culture: string,
  start: string,
  stats: {
    strength: string,
    constitution: string,
    size: string,
    dexterity: string,
    speed: string,
    empathy: string,
    intelligence: string,
    willpower: string
  }
}


@Component({
  selector: 'tg-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})


export class RegistrationComponent implements OnInit {

  @ViewChild('registrationStepper') stepper: MatStepper;

  firstStepGroup: FormGroup;
  secondStepGroup: FormGroup;
  regFormSub: Subscription;
  regData: FormArray;


  constructor( private fb: FormBuilder ) { }

  ngOnInit() {
    this.firstStepGroup = this.fb.group({
      race: ['umano', Validators.required]
    });

    this.secondStepGroup = this.fb.group({});

    this.firstStepGroup.valueChanges.subscribe(newVal => console.log(newVal));
  }

  nextStep(event: any) {
    console.log(event);
    this.stepper.next();
  }
}
