import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'tg-step-first',
  templateUrl: './step-first.component.html',
  styleUrls: ['./step-first.component.scss']
})
export class StepFirstComponent implements OnInit {
  
  @Output() stepDone = new EventEmitter<boolean>(false);
  @Input() parentForm: FormGroup;

  selectedRace: string;

  constructor() {
  }

  ngOnInit() {
    this.selectedRace = this.parentForm.controls['race'].value;
  }

  get race() {
    return this.parentForm.controls['race'].value
  }
  setRace(race: string) {
    this.selectedRace = race;
    this.parentForm.setValue({
      race: race
    })
  }

  goNext() {
    this.stepDone.emit(true);
  }
}
