import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ethnicity } from 'src/assets/data/ethnicity/ethnicity.const';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'tg-step-second',
  templateUrl: './step-second.component.html',
  styleUrls: ['./step-second.component.scss']
})
export class StepSecondComponent {

  @Input('race') race: any;
  
  frmStepSecond: FormGroup;
  ethnicityList = ethnicity;
  ethnicityDetailText: string;
  race_code: number;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
    ) {
    this.frmStepSecond = this.fb.group({
      race_code: ['', Validators.required ]
    });
  }


  setEthnicity(eth: any) {

    this.ethnicityDetailText = '';

    this.http.get('assets/data/ethnicity/' + eth.help_url , {responseType: 'text'})
      .subscribe((data) => {
        this.ethnicityDetailText = data;
      });

      this.race_code = eth.code;
      this.frmStepSecond.setValue({
        race_code: this.race_code
      });
    }
}