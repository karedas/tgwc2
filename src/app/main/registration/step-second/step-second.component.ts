import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tg-step-second',
  templateUrl: './step-second.component.html',
  styleUrls: ['./step-second.component.scss']
})
export class StepSecondComponent implements OnInit {
  autoTicks = false;
  max = 100;
  min = 0;
  showTicks = false;
  step = 1;
  thumbLabel = false;
  value = 50;

  constructor() { }

  ngOnInit() {
  }

}
