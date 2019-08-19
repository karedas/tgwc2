import { Component, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { MediaMatcher, Breakpoints } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';


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
    private http: HttpClient,
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef
  ) {
    this.mobileQuery = media.matchMedia(Breakpoints.XSmall);
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}
