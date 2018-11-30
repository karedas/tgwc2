import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsernameValidation, PasswordValidation } from '../../common/validations';

import { SocketService } from '../../services/socket.service';
import { NetworkStatusService } from 'src/app/services/networkstatus.service';

import { rotateTextAnimation } from './rotateText.animation';


@Component({
  selector: 'tg-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [rotateTextAnimation]
})
export class LoginComponent implements OnInit {

  submited = false;
  serverStatusText: String;
  loginForm: FormGroup;
  loginFormErrors: any;
  loginFailed: boolean;
  // loading = false;
  phrases = [];


  constructor(
    private socketService: SocketService,
    private formBuilder: FormBuilder,
    private networkStatus: NetworkStatusService
    // private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {

    this.networkStatus.currentStatus.subscribe(serverStatusText => this.serverStatusText = serverStatusText);
    
    this.loginForm = this.formBuilder.group({
      username: ['', UsernameValidation],
      password: ['', PasswordValidation]
    });
    
    this.setupPhrasesRotator();
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {

    this.submited = true;

    if (this.loginForm.invalid) {
      return;
    }
  }

  setupPhrasesRotator() {
    this.phrases = [
      {autore: "Anonimo", frase: "L'importante non è Guardare, occorre Vedere."},
      {autore: 'Una guardia cittadina', frase: 'Nuovo giorno, buon giorno!'},
      {autore: 'Strane creature di Ikhari', frase: 'Strane creature di Ikhari'}
    ]
  }
}
