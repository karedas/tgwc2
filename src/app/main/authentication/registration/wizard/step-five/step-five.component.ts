import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'tg-step-five',
  templateUrl: './step-five.component.html',
  styleUrls: ['./step-five.component.scss']
})
export class StepFiveComponent implements OnInit {

  frmStepFive: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
    ) {
    this.frmStepFive = this.fb.group({
      start: ['', Validators.required],
    });
  }

  ngOnInit() {
  }

}
