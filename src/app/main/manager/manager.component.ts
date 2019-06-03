import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';



@Component({
  selector: 'tg-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit {
  
  selectedItem = 0;
  


  isAdmin: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }
  
  selectItmeMenu(i) {
    this.selectedItem = i;
  }

  isEnableFor(level: string): boolean {
    return this.authService.isEnableTo(level);
  }

}
