import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor() { }

  parseForLog(data: any) {

    // Not repeated tags

    data = data.replace(/&[xe]\n*/gm, '');
    data = data.replace(/&o.\n*/gm, '');
    data = data.replace(/&d\d{6}\n*/gm, '');
    data = data.replace(/&!au"[^"]*"\n*/gm, '');

    // Player status
    data = data.replace(/&!st\{[\s\S]*?\}!/gm, '');
    data = data.replace(/&!up"[^"]*"\n*/gm, '');
    data = data.replace(/&!img"[^"]*"\n*/gm, '');
    data = data.replace(/&!im"[^"]*"\n*/gm, '');
    data = data.replace(/&!logged"[^"]*"/gm, '');
    data = data.replace(/&!e[ad]"[^"]*"\n*/gm, '');
    data = data.replace(/&!s[mi]"[^"]*"/gm, '');
    data = data.replace(/&!as"[^"]*"/gm, '');

    // Map data
    // TODO: Draw map?
    data = data.replace(/&!map\{[\s\S]*?\}!/gm, '');

    // Book
    data = data.replace(/&!book\{[\s\S]*?\}!/gm, '');

    // List of commands
    data = data.replace(/&!cmdlst\{[\s\S]*?\}!/gm, '');







    // Refresh
    data = data.replace(/&!refresh\{[\s\S]*?\}!/gm, '');

    // Selectable generic
    data = data.replace(/&!select\{[\s\S]*?\}!/gm, '');

    data = data.replace(/&!crlf"[^"]*"/gm, '');
    data = data.replace(/&\*/gm, '');


    data = data.replace(/&!m"(.*)"\{([\s\S]*?)\}!/gm, (line: any ,type: any ,data: any ) => {
      return data;
    });
  
    data = data.replace(/&!ce"[^"]*"/gm, '');
  
    data = data.replace(/&!ulink"[^"]*"/gm, (link) => {
      var link = link.slice(8, -1).split(',');
      return link[1];
    });
  
    data = data.replace(/&(i|I\d)/gm, '');
  
    data = data.replace(/\n/gm, '<br>');

    data = '<p>'+ this.removeColors(data)+'</p>';

    console.log(data)

  }

  private removeColors(data) {
    return data.replace(/&[BRGYLMCWbrgylmcw-]/gm, '');
  }


  private printPrompt(st) {
    return '';
  }
}
