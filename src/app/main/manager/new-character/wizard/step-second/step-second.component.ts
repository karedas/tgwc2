import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ethnicity } from 'src/assets/data/ethnicity/ethnicity.const';
import { HttpClient } from '@angular/common/http';
import { RegistrationService } from '../../services/registration.service';

@Component({
  selector: 'tg-step-second',
  templateUrl: './step-second.component.html',
  styleUrls: ['./step-second.component.scss']
})
export class StepSecondComponent {

  // Public
  frmStepSecond: FormGroup;
  ethnicityList = ethnicity;
  ethnicityDetailText: string;
  race_label: string;

  @Input('race') race: string;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private registrationService: RegistrationService
  ) {
    this.frmStepSecond = this.fb.group({
      race_code: ['', Validators.required]
    });
  }

  setEthnicity(eth: any) {
    if (eth.limited) {
      return;
    }

    this.ethnicityDetailText = '';
    this.http.get('assets/data/ethnicity/' + eth.help_url, { responseType: 'text' })
      .subscribe((data) => {
        this.ethnicityDetailText = data;
      });

    this.frmStepSecond.setValue({
      race_code: eth.code
    });
  }
}
