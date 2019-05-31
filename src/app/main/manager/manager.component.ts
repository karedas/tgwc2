import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';


@Component({
  selector: 'tg-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit {
  
  isAdmin: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }
  
  isEnableFor(level: string): boolean {
    return this.authService.isEnableTo(level);
  }

  

}
