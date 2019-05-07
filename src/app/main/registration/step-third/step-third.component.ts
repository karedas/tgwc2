import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { ethnicity } from '../data/ethnicity.const';
import { MatRadioChange } from '@angular/material';

@Component({
  selector: 'tg-step-third',
  templateUrl: './step-third.component.html',
  styleUrls: ['./step-third.component.scss']
})
export class StepThirdComponent implements OnInit{

  @Input() parentForm: FormGroup;

  ethnicityList = ethnicity;
  selectedBaseRace: string;
  
  race_code: string;

  constructor(private fb: FormBuilder) {

   }



  ngOnInit() {
    this.selectedBaseRace = (this.parentForm.get('formArray') as FormArray).value[0].race;
  }

  setEthnicity(event: MatRadioChange) {
    (this.parentForm.get('formArray') as FormArray).controls[2].setValue({race_code: event.value});
  }

}
