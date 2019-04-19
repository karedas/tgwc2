import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { scan } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  lineNumber: number = 0;
  log$: ReplaySubject<any> = new ReplaySubject<any>(500);
  logStorage = [];

  constructor() {
    this.log$.pipe(
      scan((acc, curr) => { Object.assign({}, acc, curr), {} }),
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
      return this.printDateTime(parse_time);
    });

    data = data.replace(/&!region\{[\s\S]*?\}!/gm, (region) => {
      const region_parse = JSON.parse(region.slice(8, -1));
      return this.printRegion(region_parse);
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
      link = link.slice(8, -1).split(',');
      return link[1];
    });

    data = data.replace(/&(i|I\d)/gm, '');

    if (data !== 'undefined' && data !== undefined && data !== '') {
      data = this.removeColors(data);
      data = data.replace(/\n/gm, '<br>');
      data.replace(/<p><\/p>/g, '');

      //Update the Observable Subject
      const n = this.lineNumber;
      this.log$.next({ l: ++this.lineNumber, d: data });
    }
  }

  private removeColors(data) {
    return data.replace(/&[BRGYLMCWbrgylmcw-]/gm, '');
  }


  private printPrompt(st) {
    return '';
  }

  private printDateTime(date) {
    return `<p>E' ${date.datestr} </p>`;
  }

  private printRegion(region) {
    let msg: string;
    msg += '<p>';
    msg += `Ti trovi in: ${region.name} (${region.type})<br>`;
    msg += `Controllata da: ${region.clan_name}`;
    msg += '</p>';

    return msg;
  }

  private printPage(p) {
    return '<h3>'+p.title + '</h3><div>' + p.text.replace(/\n/gm, '<br>') + '</div>';
  }

  private printTable(t) {
    return '';
    // let txt ='<table>';

    // if(t.title && t.dialog == false)
    //   txt += '<caption>' + t.title + '</caption>';
  
    // if(t.head) {
    //   txt += '<thead><tr>'
    //   t.head.forEach((v, i) => {

    //     switch(typeof v) {
    //       case "object":
    //         txt += '<th>'+v.title+'</th>';
    //         break;
    
    //       default:
    //         txt += '<th>'+v+'</th>';
    //         break;
    //       }
    //   });
    //   txt += '</tr></thead>';
    // }
  
    // if(t.data) {
    //  t.data.forEach( (row, ri) => {
    //     txt += '<tr>';

    //     row.forEach( (elem, di) => {
  
    //       let h = t.head ? t.head[di] : null;
          
    //       switch(typeof h) {
    //         case "object":
    //           switch(h.type) {
    //             case "account":
    //               txt += '<td><a target="_blank" href="/admin/accounts/'+elem+'">'+elem+'</a></td>';
    //               break;
  
    //             case "ipaddr":
    //               txt += '<td><a target="_blank" href="http://www.infosniper.net/index.php?ip_address='+elem+'">'+elem+'</a></td>';
    //               break;
  
    //             // case "icon":
    //             //   txt += '<td>'+ elem +'</td>';
    //             //   break;
  
    //             default:
    //               txt += '<td>'+elem+'</td>';
    //               break;
    //           }
    //           break;
  
    //         default:
    //           txt += '<td>'+elem+'</td>';
    //           break;
    //       }
    //     });
    //     txt += '</tr>';
    //   });
    // }
  
    // txt += '</table>';
  }

  private printDetails(info, type) {

    let res = '';

    if (info.title)
      // res += '<h3>'+ capFirstLetter (info.title) +'</h3>';
      res += '<h3>' + info.title + '</h3>';
    // 

    if (info.action)
      res += '<p>' + info.action + '</p>';

    /* Print description */
    if (info.desc) {
      if (info.desc.base)
        res += info.desc.base;

      if (info.desc.details)
        res += info.desc.details;

      if (info.desc.equip)
        res += info.desc.equip;
    }

    /* Print person list */
    if (info.perscont)
      res += this.printDetailsList(info.perscont, 'pers');

    /* Print objects list */
    if (info.objcont)
      res += this.printDetailsList(info.objcont, 'obj');

    /* Print equipment list */
    if (info.eqcont)
      res += this.printDetailsList(info.eqcont, 'obj');

    return res;
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

  private printDetailsList(cont, type) {
    let res = '';

    if (cont.list) {
      if (cont.title)
        res += '<p>' + cont.title + '</p>';

      for (let n = 0; n < cont.list.length; n++) {
        let l = cont.list[n];
        res += this.printDecoratedDescription(type, l.condprc, l.mvprc, l.mrn ? l.mrn.length : 0, l.desc) + '<br>';
      }

      if (cont.title && (cont.list.length > 0 || cont.show === true))
        res += 'Niente.<br>';
    }

    return res;
  }

  private printDecoratedDescription(type, condprc, moveprc, count, desc) {
    let res = '[' + type[0] + ']&#160;' + desc.replace(/\n/gm, ' ');

    if (condprc || moveprc) {
      res += '&#160;{'
      if (condprc)
        res += 'pf' + condprc + '%';
      if (moveprc)
        res += 'mv' + moveprc + '%';
      res += '}'
    }

    if (count > 1)
      res += '&#160;[x' + count + ']';

    return res;
  }

}
