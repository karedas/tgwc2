import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'tg-welcome-registration',
  templateUrl: './welcome-registration.component.html',
  styleUrls: ['./welcome-registration.component.scss']
})
export class WelcomeRegistrationComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  checkCodeActivation() {
    this.router.navigate(['/auth/registrazione/wizard']);
  }

  requestCodeViaEmail() {}


}
