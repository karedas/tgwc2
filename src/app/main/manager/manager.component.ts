import { Component, OnInit, ViewEncapsulation, Input, AfterViewInit, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { SidenavService } from './services/sidenav.service';
import { MediaMatcher, BreakpointObserver, Breakpoints } from '@angular/cdk/layout';



@Component({
  selector: 'tg-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ManagerComponent implements OnInit, OnDestroy {

  @ViewChild('sidenav', { static: true }) public sidenav: MatSidenav;
  
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;

  constructor(
    private sidenavService: SidenavService,
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef
  ) {

    this.mobileQuery = media.matchMedia(Breakpoints.XSmall);
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

  }

  ngOnInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
