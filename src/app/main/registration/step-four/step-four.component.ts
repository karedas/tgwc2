import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IStats } from '../models/creation_data.model';
import { HttpClient } from '@angular/common/http';
import { MatSliderChange } from '@angular/material';

@Component({
  selector: 'tg-step-four',
  templateUrl: './step-four.component.html',
  styleUrls: ['./step-four.component.scss']
})
export class StepFourComponent implements OnInit {

  frmStepFour: FormGroup;
  points: number;

  attributesList: IStats = {
    strength: 0,
    constitution: 0,
    size: 0,
    dexterity: 0,
    speed: 0,
    empathy: 0,
    intelligence: 0,
    willpower: 0
  }

  // Sliders Configuration
  readonly autoTicks = false;
  readonly max = 80;
  readonly min = 20;
  readonly step = 10;
  readonly thumbLabel = false;
  readonly value = 50;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit() {

    this.frmStepFour = this.fb.group({
      strength: [0, Validators.required],
      constitution: [0, Validators.required],
      size: [0, Validators.required],
      dexterity: [0, Validators.required],
      speed: [0, Validators.required],
      empathy: [0, Validators.required],
      intelligence: [0, Validators.required],
      willpower: [0, Validators.required],
    });

    this.calculateUsedPoints();


    //DEBUG 
    this.frmStepFour.valueChanges.subscribe((val) => {console.log(val)})

  }

  private calculateUsedPoints() {
    let sum = 0;

    Object.keys(this.attributesList).map(e => {
      sum -= this.statCost(this.attributesList[e]);
    });

    this.points = sum;
  }

    private statCost(val: number) {
    const cost = [-40, -30, -20, -15, -10, -5, 0, 5, 10, 15, 25, 40, 60];
    const idx = (30 + val) / 5;

    return cost[idx];
  }


  changeAttribute(event: MatSliderChange, id?: any) {
    let attr = {}
    attr[id] = event.value;
    this.frmStepFour.patchValue(attr)
  }

}
