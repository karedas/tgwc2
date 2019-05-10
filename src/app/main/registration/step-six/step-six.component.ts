import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'tg-step-six',
  templateUrl: './step-six.component.html',
  styleUrls: ['./step-six.component.scss']
})
export class StepSixComponent implements OnInit {


  frmStepSix: FormGroup;

  constructor(private fb: FormBuilder) { 
    this.frmStepSix = this.fb.group({});
  }

  ngOnInit() {
  }

}
