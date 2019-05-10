import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { cultures } from 'src/assets/data/cultures/cultures.const';

@Component({
  selector: 'tg-step-third',
  templateUrl: './step-third.component.html',
  styleUrls: ['./step-third.component.scss']
})
export class StepThirdComponent{

  @Input('race_code') baseEthnicity: string ;

  frmStepThird: FormGroup;
  culturesList = cultures;
  selectedCulture: string;
  cultureDetailText: string;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
    ) {
    this.frmStepThird = this.fb.group({
      culture: ['', Validators.required ]
    });
   }

  setCultures(culture: string) {

    this.cultureDetailText = '';
    
    //Load Html content
    this.http.get('assets/data/cultures/'+ culture +'.html', {responseType: 'text'})
    .subscribe((data) => {
      this.cultureDetailText = data;
      this.selectedCulture = culture;
    });
    
    this.frmStepThird.setValue({
      culture: culture
    })
  }
}
