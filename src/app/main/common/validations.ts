import { Validators } from '@angular/forms';

export const UsernameValidation = [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(20),
  ];

export const PasswordValidation = [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(50),
  ];


