import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'icons'
})
export class IconsPipe implements PipeTransform {
  constructor(private _sanitizer: DomSanitizer) {
  }

  transform(value: any, ...args: any): any {
    value = value.replace(/&!sm"[^"]*"/gm, (icon: any) => {
      const icon_parse = icon.slice(5, -1).split(',');
      return this.renderIcon(icon_parse[0], icon_parse[1], 'room', null, null, 'interact pers');
    });
    value = value.replace(/&!si"[^"]*"/gm, (icon: any) => {
      const icon_parse = icon.slice(5, -1).split(',');
      return this.renderIcon(icon_parse[0], null, null, null, null, 'v' + icon_parse[1]);
    });

    return this._sanitizer.bypassSecurityTrustHtml(value ? String(value) : '');
  }

  renderIcon(icon: number, mrn: string, cnttype: string, cntmrn: string, cmd: string, addclass: string): any {
    icon = +icon;

    if (!icon) {
      icon = 416;
    }
    return `<div class="tg-icons">
       <div class="tg-icon ico_'${icon}" style="background-position:${this.tileBgPos(icon)}"></div>
    </div>`;
  }

  tileBgPos(tilenum): string {
    const tc = this.tileCoords(tilenum);
    return '-' + tc[0] + 'px -' + tc[1] + 'px';
  }

  tileCoords(tilenum): any {
    const posx = 32 * (tilenum & 0x7f);
    const posy = 32 * (tilenum >> 7);
    return [posx, posy];
  }


}
