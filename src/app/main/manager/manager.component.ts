import { Component, OnInit, ViewEncapsulation, Input, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { MatSidenav } from '@angular/material';
import { SidebarService } from './sidebar/sidebar.service';



@Component({
  selector: 'tg-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ManagerComponent implements OnInit {

  @Input('sidenav') sidenav: MatSidenav;
    constructor(private authService: AuthService, private sidebarService: SidebarService) { 
  }
  
  ngOnInit(): void {
    console.log(this.sidenav);
    this.sidebarService.setSidenav(this.sidenav);
  }

}
