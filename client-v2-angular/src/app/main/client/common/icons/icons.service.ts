import { Injectable } from '@angular/core';
import { MIcons } from './icons.model';

@Injectable({
  providedIn: 'root'
})
export class IconsService {

  _icon: number;
  _mrn: number;
  _cnttype: string;
  _cntmrn: number;
  _cmd: string;
  _addclass: string;

  constructor() { }

  public tileBgPos (tilenum: number): string {
    const tc = this.tileCoords(tilenum);
    return `-${tc[0]}px -${tc[1]}px`
  }

  private tileCoords(tilenum: number): number[] {
    const posx = 32 * (tilenum & 0x7f);
    const posy = 32 * (tilenum >> 7);

    return [posx, posy]
  }

  getIcon(objIcon: MIcons)
     {
    if(!objIcon.icon) {
      objIcon.icon = 416;
    }
  }

  set icon(value: number) {
    this._icon = value;
  }

  get icon(): number {
    return this._icon;
  }

  set mrn(value: number) {
    this._mrn = value;
  }

  get mrn(): number {
    return this._mrn;
  }

  set cnttype(value: string) {
    this._cnttype = value;
  }

  get cnttype(): string {
    return this._cnttype;
  }

  set cntmrn(value: number) {
    this._cntmrn = value;
  }

  get cntmrn(): number {
    return this._cntmrn;
  }

  set cmd(value: string) {
    this._cmd = value;
  }

  get cmd(): string {
    return this._cmd;
  }

}

