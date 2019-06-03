import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { tgAnimations } from 'src/app/animations';

@Component({
  selector: 'tg-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  animations: [ tgAnimations ]
})
export class ForgotPasswordComponent implements OnInit {
  
  forgotPasswordForm: FormGroup;

  constructor( private fb: FormBuilder) { }

  ngOnInit(): void
  {
      this.forgotPasswordForm = this.fb.group({
          email: ['', [Validators.required, Validators.email]]
      });
  }
}
