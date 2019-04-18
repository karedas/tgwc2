import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { scan } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  
  log$: ReplaySubject<any> = new ReplaySubject<any>(500);
  logStorage = [];

  constructor() { 
    this.log$.pipe(
      scan((acc, curr) => { Object.assign({}, acc, curr), {}} ),
    )
    this.log$.asObservable();
  }

  get log(): Observable<any> {
    return this.log$
  }

  resetLog() {
  }

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
    data = data.replace(/&!news\{[\s\S]*?\}!/gm, '');
    data = data.replace(/&!pgdata\{[\s\S]*?\}!/gm, '');
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

    // Data Time
    data = data.replace(/&!datetime\{[\s\S]*?\}!/gm, (time) => {
      const parse_time = JSON.parse(time.slice(10, -1));
      return parse_time;
    });

    data = data.replace(/&!region\{[\s\S]*?\}!/gm, (region) => {
      return '';
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
    
    if (data !== 'undefined' && data !== undefined && data !== '') {
      data = this.removeColors(data);
      data = data.replace(/\n/gm, '<br>');
      data.replace(/<p><\/p>/g, '');

      //Update the Observable Subject
      this.log$.next(data);
    }


  }

  private removeColors(data) {
    return data.replace(/&[BRGYLMCWbrgylmcw-]/gm, '');
  }


  private printPrompt(st) {
    return '';
  }

  private printPage(page) {
    return '';
  }

  private printTable(page) {
    return '';
  }

  private printDetails(detail, type) {
    return '';
  }

  private printInventory(inv) {
    return '';
  }

  private printEquipment(eq) {
    return '';
  }

  private printWorksList(wklist) {
    return '';
  }

  private printSkillsList(skills) {
    return '';
  }

  private printPlayerInfo(pinfo) {
    return '';
  }

  private printPlayerStatus(status) {
    return '';
  }
}
