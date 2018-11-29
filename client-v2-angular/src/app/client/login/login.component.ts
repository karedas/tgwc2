import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SocketService } from '../../services/socket.service';


@Component ({
  selector: 'tg-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loginFormErrors: any;
  loginFailed: boolean;


  constructor(
    private socketService: SocketService
  ) { 
    
  }

  ngOnInit() {
    console.log('login init');
  }

  
  get email() {
    return;
  }
  
  get password() {
    return;
  }
  
  onLoginFormValuesChanged() {}

  public loginUser(event): void {
    event.preventDefault();
    console.log(event);
    // if(this.loginForm.invalid) {
    //   return;
    // }
  }


}
