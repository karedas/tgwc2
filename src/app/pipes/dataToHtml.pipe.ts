import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataToHtml'
})
export class DataToHtmlPipe implements PipeTransform {

  transform(value: any, formaText?: boolean, brParse?: boolean, styleclass?: string): string {
    value = value.replace(/&B/gm, '<span class="tg-gray">');
    value = value.replace(/&R/gm, '<span class="tg-lt-red">');
    value = value.replace(/&G/gm, '<span class="tg-lt-green">');
    value = value.replace(/&Y/gm, '<span class="tg-yellow">');
    value = value.replace(/&L/gm, '<span class="tg-lt-blue">');
    value = value.replace(/&M/gm, '<span class="tg-lt-magenta">');
    value = value.replace(/&C/gm, '<span class="tg-lt-cyan">');
    value = value.replace(/&W/gm, '<span class="tg-white">');
    value = value.replace(/&b/gm, '<span class="tg-black">');
    value = value.replace(/&r/gm, '<span class="tg-red">');
    value = value.replace(/&g/gm, '<span class="tg-green">');
    value = value.replace(/&y/gm, '<span class="tg-brown">');
    value = value.replace(/&l/gm, '<span class="tg-blue">');
    value = value.replace(/&m/gm, '<span class="tg-magenta">');
    value = value.replace(/&c/gm, '<span class="tg-cyan">');
    value = value.replace(/&w/gm, '<span class="tg-lt-white">');
    value = value.replace(/&-/gm, '</span>');

    if (brParse) {
      value = value.replace(/\n/gm, '<br>');
    }

    if (formaText) {
      let page = '';
      const parags = value = value.replace(/\r/gm, '').replace(/([^.:?!,])\s*\n/gm, '$1 ').split(/\n/);
      parags.forEach(val => {
        if (val !== '') {
          page += '<div' + (styleclass ? ' class="' + styleclass + '"' : '') + '>' + val + '</div>';
        }
      });
      return page;
    }

    return  value ? String(value) : '';
  }

}