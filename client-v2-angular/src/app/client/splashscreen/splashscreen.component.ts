import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'tg-splashscreen',
  templateUrl: './splashscreen.component.html',
  styleUrls: ['./splashscreen.component.scss']
})
export class SplashscreenComponent implements OnInit {

  @Input('preloadPerc') preloadPerc:number; 
  constructor() { }

  ngOnInit() {
  }

}
