import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrationService } from '../services/registration.service';

@Component({
  selector: 'tg-welcome-registration',
  templateUrl: './welcome-registration.component.html',
  styleUrls: ['./welcome-registration.component.scss']
})
export class WelcomeRegistrationComponent implements OnInit {

  userEmail: string;

  constructor(
    private router: Router,
    private registrationService: RegistrationService
    ) { }
  ngOnInit() {
  }

  checkCodeActivation() {
    this.router.navigate(['/auth/registrazione/wizard']);
  }

  requestCodeViaEmail() {
    this.registrationService.requestNewInvitationCode(this.userEmail);
  }


}
