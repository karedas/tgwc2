import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IStats } from '../../models/creation_data.model';
import { HttpClient } from '@angular/common/http';

export const attributes: IStats  = {
  strength: 0,
  constitution: 0,
  size: 0,
  dexterity: 0,
  speed: 0,
  empathy: 0,
  intelligence: 0,
  willpower: 0
}
@Component({
  selector: 'tg-step-four',
  templateUrl: './step-four.component.html',
  styleUrls: ['./step-four.component.scss']
})

export class StepFourComponent implements OnInit {

  frmStepFour: FormGroup;

  hasError: boolean = false;
  points: number;

  attributeHover: boolean;
  attributeDesc: string;

  attributesList = attributes;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.frmStepFour = this.fb.group(this.attributesList);
  }

  ngOnInit() {
    this.points = this.calculateUsedPoints();
  }

  private calculateUsedPoints() {
    let sum = 0;
    Object.keys(this.attributesList).map(e => {
      sum -= this.statCost(this.attributesList[e]);
    });
    return sum;
  }

  private statCost(val) {
    // -120 min gain
    // 265 max used
    const cost = [ -40, -30, -20, -15, -10, -5, 0, 20, 35, 45, 50, 55, 60];
    const idx = (30 + val) / 5;
    return cost[idx];
  }

  verifyAttr() {
    if(this.calculateUsedPoints() < 0) {
      this.hasError = true;
    } else this.hasError = false;

  }

  getErrorMessage() {
    if(this.calculateUsedPoints() <= 0 ) {
      return 'Hai usato troppi punti rispetto al totale.';
    }
  }

  increaseAttr(event: any, id?: any) {
    if (this.attributesList[id] < 30) {
      this.attributesList[id] = this.attributesList[id] + 5;
      this.frmStepFour.controls[id].patchValue(this.statCost(this.attributesList[id]));
      this.points = this.calculateUsedPoints();
    }

  }

  decreaseAttr(event: any, id?: any) {
    if (this.attributesList[id] > -30) {
      this.attributesList[id] = this.attributesList[id] - 5;
      this.frmStepFour.controls[id].patchValue(this.statCost(this.attributesList[id]));
      this.points = this.calculateUsedPoints();
    }
  }

  //on Mouse Over, showing description
  onAttribute(event: any, fileName: string) {
    if (!fileName) {
      this.attributeHover = false;
      return;
    }

    this.http.get('assets/data/attributes/' + fileName + '.html', { responseType: 'text' })
      .subscribe((data) => {
        this.attributeDesc = data;
        this.attributeHover = true;
      });
  }
}
