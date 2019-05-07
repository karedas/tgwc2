import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'tg-step-first',
  templateUrl: './step-first.component.html',
  styleUrls: ['./step-first.component.scss']
})
export class StepFirstComponent implements OnInit {
  
  @Input() parentForm: FormControl;
  @Output() stepDone = new EventEmitter<boolean>(false);

  selectedRace: string;

  constructor() {}

  ngOnInit() {
  }
  
  setRace(race: string) {
    this.selectedRace = race;
    (this.parentForm.get('formArray') as FormArray).controls[0].patchValue({race: race});
  }

  goNext() {
    this.stepDone.emit(true);
  }
}
