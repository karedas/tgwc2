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


    // Generic page (title, text)
    data = data.replace(/&!page\{[\s\S]*?\}!/gm, (p) => {
      p = JSON.parse(p.slice(6, -1));
      return this.printPage(p)
    });

    // Generic table (title, head, data)
    data = data.replace(/&!table\{[\s\S]*?\}!/gm, (t) => {
      t = JSON.parse(t.slice(7, -1));
      return this.printTable(t);
    });

    // Room details
    data = data.replace(/&!room\{[\s\S]*?\}!/gm, (dtls) => {
      dtls = JSON.parse(dtls.slice(6, -1));
      return this.printDetails(dtls, 'room');
    });

    // Person details
    data = data.replace(/&!pers\{[\s\S]*?\}!/gm, (dtls) => {
      dtls = JSON.parse(dtls.slice(6, -1));
      return this.printDetails(dtls, 'pers');
    });

    // Object details
    data = data.replace(/&!obj\{[\s\S]*?\}!/gm, (dtls) => {
      dtls = JSON.parse(dtls.slice(5, -1).replace(/\n/gm, ' '));
      return this.printDetails(dtls, 'obj');
    });

    // Inventory
    data = data.replace(/&!inv\{[\s\S]*?\}!/gm, (inv) => {
      inv = JSON.parse(inv.slice(5, -1));
      return this.printInventory(inv);
    });

    // Equipment
    data = data.replace(/&!equip\{[\s\S]*?\}!/gm, (eq) => {
      eq = JSON.parse(eq.slice(7, -1).replace(/\n/gm, '<br>'));
      return this.printEquipment(eq);
    });

    // Workable lists
    data = data.replace(/&!wklst\{[\s\S]*?\}!/gm, (wk) => {
      wk = JSON.parse(wk.slice(7, -1));
      return this.printWorksList(wk);
    });

    // Skill list
    data = data.replace(/&!sklst\{[\s\S]*?\}!/gm, (skinfo) => {
      skinfo = JSON.parse(skinfo.slice(7, -1));
      return this.printSkillsList(skinfo);
    });

    // Player info
    data = data.replace(/&!pginf\{[\s\S]*?\}!/gm, (info) => {
      info = JSON.parse(info.slice(7, -1));
      return this.printPlayerInfo(info);
    });

    // Player status
    data = data.replace(/&!pgst\{[\s\S]*?\}!/gm, (status) => {
      status = JSON.parse(status.slice(6, -1));
      return this.printPlayerStatus(status);
    });


    // Refresh
    data = data.replace(/&!refresh\{[\s\S]*?\}!/gm, '');

    // Selectable generic
    data = data.replace(/&!select\{[\s\S]*?\}!/gm, '');

    data = data.replace(/&!crlf"[^"]*"/gm, '');
    data = data.replace(/&\*/gm, '');


    data = data.replace(/&!m"(.*)"\{([\s\S]*?)\}!/gm, (line: any, type: any, data: any) => {
      return data;
    });

    data = data.replace(/&!ce"[^"]*"/gm, '');

    data = data.replace(/&!ulink"[^"]*"/gm, (link) => {
      var link = link.slice(8, -1).split(',');
      return link[1];
    });

    data = data.replace(/&(i|I\d)/gm, '');

    data = data.replace(/\n/gm, '<br>');

    data = '<p>' + this.removeColors(data) + '</p>';

    console.log(data)

  }

  private removeColors(data) {
    return data.replace(/&[BRGYLMCWbrgylmcw-]/gm, '');
  }


  private printPrompt(st) {
    return '';
  }

  private printPage(page) {}

  private printTable(page) {}

  private printDetails(detail, type) {}

  private printInventory(inv) {}

  private printEquipment(eq) {}

  private printWorksList(wklist) {}

  private printSkillsList(skills) {}

  private printPlayerInfo(pinfo) {}

  private printPlayerStatus(status) {}
}
