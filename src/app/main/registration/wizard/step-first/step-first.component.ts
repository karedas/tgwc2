import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { races } from 'src/assets/data/races/races.const';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'tg-step-first',
  templateUrl: './step-first.component.html',
  styleUrls: ['./step-first.component.scss']
})
export class StepFirstComponent {
 
  racesList = races;
  frmStepFirst: FormGroup;
  raceDetailText: string;

  constructor( 
    private fb: FormBuilder,
    private http: HttpClient
    ) {
    this.frmStepFirst = this.fb.group({
      race: ['', Validators.required ]
    });
  }

  setRace(race: any) {
    
    this.raceDetailText = '';
    
    //Load Html Detail file
    this.http.get('assets/data/races/'+ race.code +'.html', {responseType: 'text'})
    .subscribe((data) => {
      this.raceDetailText = data;
    });

    this.frmStepFirst.setValue({ race: race.code });
 
  }
}
