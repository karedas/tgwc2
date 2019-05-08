import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tg-step-third',
  templateUrl: './step-third.component.html',
  styleUrls: ['./step-third.component.scss']
})
export class StepThirdComponent implements OnInit{

  frmStepThird: FormGroup;

  constructor(private fb: FormBuilder) {
    this.frmStepThird = this.fb.group({
      race_code: ['', Validators.required ]
    });
   }



  ngOnInit() {
  //   this.parentForm.valueChanges
  //     .pipe(
  //       map((value) => )
  //     )
  //     .subscribe((value) => console.log(value));
  //   this.selectedBaseRace = (this.parentForm.get('formArray') as FormArray).value[0].race;
  // }

  // setEthnicity(event: MatRadioChange) {
  //   (this.parentForm.get('formArray') as FormArray).controls[2].setValue({race_code: event.value});
  }

}
