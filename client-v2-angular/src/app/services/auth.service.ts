import { Injectable } from '@angular/core';

import { Role } from '../models/role.enum';



export interface IAuthService {
}

export interface IAuthStatus {
  isAuthenticated: boolean
  userLevel: Role
  userId: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements IAuthService{

  constructor() { }

  login(userId: string, password: string) {
    
  }
}
