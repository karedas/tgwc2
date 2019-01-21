import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { MIcons } from './icons.model';

@Component({
  selector: 'tg-icons',
  templateUrl: './icons.component.html',
  styles: ['tg-icons{margin: auto 2px;}'],
  encapsulation: ViewEncapsulation.None
})
export class IconsComponent implements OnInit {
  @Input('icon') iconObj: number;

  _icon: number;
  _mrn: number;
  _cnttype: string;
  _cntmrn: number;
  _cmd: string;
  _addclass: string;

  bgPositionStyle: Object;

  constructor() {
  }

  ngOnInit(): void {
    this.tileBgPos();
  }

  public tileBgPos() {
    const tc = this.tileCoords();
    
    let bgPos = {
      'background-position':`-${tc[0]}px -${tc[1]}px`
    }
    this.bgPositionStyle = bgPos;
  }

  private tileCoords(): number[] {
    const posx = 32 * (this.iconObj & 0x7f);
    const posy = 32 * (this.iconObj >> 7);

    return [posx, posy]
  }

  getIcon(objIcon: MIcons) {
    if (!objIcon.icon) {
      objIcon.icon = 416;
    }
  }
}
