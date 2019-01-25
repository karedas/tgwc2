import { Component, OnInit, Input, ViewEncapsulation, SimpleChange } from '@angular/core';
import { MIcons } from './icons.model';

@Component({
  selector: 'tg-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IconsComponent {
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

  ngOnChanges(changes: SimpleChange): void {
    this.tileBgPos();
  }

  public tileBgPos() {
    const tc = this.tileCoords();

    const bgPos = {
      'background-position': `-${tc[0]}px -${tc[1]}px`
    };
    this.bgPositionStyle = bgPos;
  }

  private tileCoords(): number[] {
    const posx = 32 * (this.iconObj & 0x7f);
    const posy = 32 * (this.iconObj >> 7);

    return [posx, posy];
  }

  getIcon(objIcon: MIcons) {
    if (!objIcon.icon) {
      objIcon.icon = 416;
    }
  }
}
