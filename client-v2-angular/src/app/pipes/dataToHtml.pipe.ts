import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataToHtml'
})
export class DataToHtmlPipe implements PipeTransform {

  transform(value: any, args?: any): string {
    // value =  value.replace(/\r/gm, '');
    // value = value.replace(/&!!/gm, '');
    // value = value.replace(/\$\$/gm, '$');
    // value = value.replace(/%%/gm, '%');
    // value = value.replace(/&&/gm, '&#38;');
    // value = value.replace(/</gm, '&#60;');
    // value = value.replace(/>/gm, '&#62;');
    // value = value.replace(/\n/gm, '<br>');
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

    return  value ? String(value) : '';
  }

}
