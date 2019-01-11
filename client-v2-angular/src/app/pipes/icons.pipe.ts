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

  renderIcon(icon, mrn: string, cnttype: string, cntmrn: string, cmd: string, addclass: string): any {
        if (!icon) {
            icon = 416;
        }
        // return '<div class="iconimg ico_' + icon + ' ' + (addclass ? ' ' + addclass : '') + '" style="background-position:' + this.tileBgPos(icon) + '"' + (mrn ? ' data-mrn="' + mrn + '"' : '') + (cmd ? ' data-cmd="' + cmd + '"' : '') + (cnttype ? ' data-cnttype="' + cnttype + '"' : '') + (cntmrn ? ' data-cntmrn="' + cntmrn + '"' : '') + '></div>';
        return '<div class="iconimg ico_' + icon + '" style="background-position:' + this.tileBgPos(icon) + '"></div>';
  }

  tileBgPos(tilenum): string {
      const _ = this;
      const tc = this.tileCoords(tilenum);
      return '-' + tc[0] + 'px -' + tc[1] + 'px';
  }

  tileCoords(tilenum): any {
      const posx = 32 * (tilenum & 0x7f);
      const posy = 32 * (tilenum >> 7);
      return [posx, posy];
  }


}
