import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ethnicity } from 'src/assets/data/ethnicity/ethnicity.const';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'tg-step-second',
  templateUrl: './step-second.component.html',
  styleUrls: ['./step-second.component.scss']
})
export class StepSecondComponent implements OnInit {

  @Input('race') baseRace: any;
  
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

  ngOnInit() {
    //DEBUG
    this.frmStepSecond.valueChanges.subscribe(val => console.log(val));
  }

  setEthnicity(eth: any) {

    this.http.get('assets/data/ethnicity/' + eth.help_url + '.html', {responseType: 'text'})
      .subscribe((data) => {
        this.ethnicityDetailText = data;
      });

      this.race_code = eth.code;
      this.frmStepSecond.setValue({
        race_code: this.race_code
      });
    }
}