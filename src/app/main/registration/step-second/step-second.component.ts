import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ethnicity } from '../data/ethnicity.const';
import { MatRadioChange } from '@angular/material';

@Component({
  selector: 'tg-step-second',
  templateUrl: './step-second.component.html',
  styleUrls: ['./step-second.component.scss']
})
export class StepSecondComponent implements OnInit {

  @Input('race') baseRace: any;

  frmStepSecond: FormGroup;
  ethnicityList = ethnicity;
  race_code: number;

  constructor(private fb: FormBuilder) {
    this.frmStepSecond = this.fb.group({
      race_code: ['', Validators.required ]
    });
  }

  ngOnInit() {
    //DEBUG
    this.frmStepSecond.valueChanges.subscribe(val => console.log(val));
  }

  setEthnicity(eth_code: number) {
    this.race_code = eth_code;
    this.frmStepSecond.setValue({
      race_code: this.race_code
    })
  }
}




// import { Component, OnInit, Input } from '@angular/core';
// import { FormGroup, FormControl } from '@angular/forms';

// @Component({
//   selector: 'tg-step-second',
//   templateUrl: './step-second.component.html',
//   styleUrls: ['./step-second.component.scss']
// })

// export class StepSecondComponent implements OnInit {

//   // Sliders Configuration
//   readonly autoTicks = false;
//   readonly max = 80;
//   readonly min = 20;
//   readonly step = 10;
//   readonly thumbLabel = false;
//   readonly value = 50;

//   @Input() parentForm: FormGroup;

//   points: number;

//   // attributesList: IStats = {
//   //   strength: 0,
//   //   constitution: 0,
//   //   size: 0,
//   //   dexterity: 0,
//   //   speed: 0,
//   //   empathy: 0,
//   //   intelligence: 0,
//   //   willpower: 0
//   // }


//   constructor(
//     // private fb: FormBuilder
//   ) { }

//   ngOnInit() {
//     // this.secondStepGroup = this.fb.group(this.attributesList);
//     // this.calculateUsedPoints();
//     //DEBUG
//     // this.secondStepGroup.valueChanges.subscribe(val => console.log('ATTRIBUTES DEBUG', val));
//   }

//   // private calculateUsedPoints() {
//   //   let sum = 0;

//   //   Object.keys(this.attributesList).map(e => {
//   //     sum -= this.statCost(this.attributesList[e]);
//   //   });

//   //   this.points = sum;
//   // }

//   // private statCost(val: number) {
//   //   const cost = [-40, -30, -20, -15, -10, -5, 0, 5, 10, 15, 25, 40, 60];
//   //   const idx = (30 + val) / 5;

//   //   return cost[idx];
//   // }

//   // changeAttribute(event: MatSliderChange, id?: any) {
//   //   let attr = {}
//   //   attr[id] = event.value;
//   //   this.secondStepGroup.patchValue(attr)
//   // }

// }
