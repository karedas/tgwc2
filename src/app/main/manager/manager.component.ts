import { Component, OnInit, ViewEncapsulation, Input, AfterViewInit, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { MediaMatcher, BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'tg-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss'],
})

export class ManagerComponent implements OnDestroy {

  @ViewChild('sidenav', { static: true }) public sidenav: MatSidenav;

  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;

  constructor(
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef
  ) {
    this.mobileQuery = media.matchMedia(Breakpoints.XSmall);
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
