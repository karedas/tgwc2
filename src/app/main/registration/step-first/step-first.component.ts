import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'tg-step-first',
  templateUrl: './step-first.component.html',
  styleUrls: ['./step-first.component.scss']
})
export class StepFirstComponent {

  @Output() stepDone = new EventEmitter<boolean>(false); 
  
  public frmStepFirst: FormGroup;
  
  selectedRace: string;

  constructor( private fb: FormBuilder) {
    this.frmStepFirst = this.fb.group({
      race: ['human', Validators.required ]
    });

  }

  setRace(race: string) {
    this.selectedRace = race;
    this.frmStepFirst.setValue({ race: race })
  }

  goNext() {
    this.stepDone.emit(true);
  }
}
