import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { scan } from 'rxjs/operators';
import { equip_positions_by_name } from '../common/constants';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  date: Date;
  lineNumber = 0;
  log$: ReplaySubject<any> = new ReplaySubject<any>(500);
  logStorage = [];

  constructor() {

    this.date = new Date();
    this.log$.pipe(
      scan((acc, curr) =>  Object.assign({}, acc, curr))
    );
  }

  getLog(): Observable<any> {
    return this.log$.asObservable();
  }

  startLoggingDate(): Date {
    return this.date;
  }



  parseForLog(data: any) {

    // Not repeated tags
    data = data.replace(/&[xe]\n*/gm, '');
    data = data.replace(/&o.\n*/gm, '');
    data = data.replace(/&d\d{6}\n*/gm, '');
    data = data.replace(/&!au"[^"]*"\n*/gm, '');

    // Player status
    data = data.replace(/&!si"[^"]*"/gm, '');
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
      return this.printPage(p);
    });

    // Data Time
    data = data.replace(/&!datetime\{[\s\S]*?\}!/gm, '');

    data = data.replace(/&!region\{[\s\S]*?\}!/gm, '');

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


    data = data.replace(/&!m"(.*)"\{([\s\S]*?)\}!/gm, (line: any, type: any, d: any) => {
      return d;
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
      data = data.replace(/<p><\/p>/g, '');

      // Update the Observable Subject
      this.log$.next({ l: ++this.lineNumber, d: data });
    }
  }

  private removeColors(data) {
    return data.replace(/&[BRGYLMCWbrgylmcw-]/gm, '');
  }


  // private printPrompt(st) {
  //   return '';
  // }

  // private printDateTime(date) {
  //   return `<p>Data: ${date.datestr} </p>`;
  // }

  // private printRegion(region) {
  //   let msg: string;
  //   msg += '<p>';
  //   msg += `Ti trovi in: ${region.name} (${region.type})<br>`;
  //   msg += `Controllata da: ${region.clan_name}`;
  //   msg += '</p>';

  //   return msg;
  // }

  private printPage(p: any): any {
    return '<h3>' + p.title + '</h3><div>' + p.text.replace(/\n/gm, '<br>') + '</div>';
  }

  private printTable(t: any): any {
    let txt = '<table>';

    if (t.title && t.dialog === false) {
      txt += '<caption>' + t.title + '</caption>';
    }

    if (t.head) {
      txt += '<thead><tr>';
      t.head.forEach((v, i) => {

        switch (typeof v) {
          case 'object':
            txt += '<th>' + v.title + '</th>';
            break;

          default:
            txt += '<th>' + v + '</th>';
            break;
        }
      });
      txt += '</tr></thead>';
    }

    if (t.data) {
      t.data.forEach((row, ri) => {
        txt += '<tr>';

        row.forEach((elem, di) => {

          const h = t.head ? t.head[di] : null;

          switch (typeof h) {
            case 'object':
              switch (h.type) {
                case 'account':
                  txt += '<td><a target="_blank" href="/admin/accounts/' + elem + '">' + elem + '</a></td>';
                  break;

                case 'ipaddr':
                  txt += '<td><a target="_blank" href="http://www.infosniper.net/index.php?ip_address=' + elem + '">' + elem + '</a></td>';
                  break;

                // case "icon":
                //   txt += '<td>'+ elem +'</td>';
                //   break;

                default:
                  txt += '<td>' + elem + '</td>';
                  break;
              }
              break;

            default:
              txt += '<td>' + elem + '</td>';
              break;
          }
        });
        txt += '</tr>';
      });
    }

    return txt += '</table>';
  }

  private printDetails(info, type) {

    let res = '';

    if (info.title) {
      // res += '<h3>'+ capFirstLetter (info.title) +'</h3>';
      res += '<h3>' + info.title + '</h3>';
    }
    //

    if (info.action) {
      res += '<p>' + info.action + '</p>';
    }

    /* Print description */
    if (info.desc) {
      if (info.desc.base) {
        res += info.desc.base;
      }

      if (info.desc.details) {
        res += info.desc.details;
      }

      if (info.desc.equip) {
        res += info.desc.equip;
      }
    }

    /* Print person list */
    if (info.perscont) {
      res += this.printDetailsList(info.perscont, 'pers');
    }

    /* Print objects list */
    if (info.objcont) {
      res += this.printDetailsList(info.objcont, 'obj');
    }

    /* Print equipment list */
    if (info.eqcont) {
      res += this.printDetailsList(info.eqcont, 'obj');
    }

    return res;
  }

  private printInventory(inv) {
    if (inv.list.length === 0) {
      return ('<p>Non hai niente in inventario!</p>');
    } else {
      return '<h4>Il tuo inventario:</h4>' + this.removeColors(this.printDetailsList(inv, 'obj'));
    }
  }

  private printEquipment(eq) {
    let res = '';
    let eqcount = 0;

    Object.keys(equip_positions_by_name).forEach((posname, idx) => {
      const eqdata = eq[posname];

      if (eqdata) {
        eqdata.forEach((obj, idxx) => {
          res += '<div>' + equip_positions_by_name[posname] + ': '
            + this.printDecoratedDescription('obj', obj.condprc, null, 1, obj.desc) + '</div>';
          eqcount++;
        });
      }
    });

    if (eqcount === 0) {
      return '<p>Non hai equipaggiato nulla!</p>';
    } else {
      return '<p>Equipaggiamento:</p>' + res;
    }
  }

  private printWorksList(wk) {
    let txt = '<table><caption>Potresti ' + wk.verb + ':</caption>';

    txt += '<thead><tr><th>#</th><th>Difficolt&agrave;</th><th>Puoi?</th><th>Descrizione</th></tr></thead><tbody>';

    for (let n = 0; n < wk.list.length; n++) {
      txt += `<tr>
                <td>${n + 1}</td>
                <td>${wk.list[n].diff}</td>
                <td>${(wk.list[n].cando ? 'si' : 'no')}</td>
                <td>${wk.list[n].desc}</td>
              </tr>`;
    }

    txt += '</tbody></table>';

    return txt;
  }

  private printSkillsList(skinfo) {
    let txt = '<table><caption>Abilit&agrave; conosciute</caption>';

    for (const groupname in skinfo) {
      if (skinfo.hasOwnProperty(groupname)) {
        txt += '<tr><td colspan="1000"><h3>' + groupname + '</h3></td></tr>';

        const group = skinfo[groupname];

        for (const skname in group) {
          if (group.hasOwnProperty(skname)) {
            txt += '<tr><th>' + skname + '</th>';
            const sk = group[skname];
            if ('prac' in sk && 'theo' in sk) {
              txt += '<td>' + sk.prac + '</td><td>' + sk.theo + '</td>';
            }
            if ('auto' in sk) {
              txt += '<td>' + (sk.auto ? 'autodidatta' : '') + '</td>';
            }
            txt += '</tr>';
          }
        }
      }


    }
    txt += '</table>';
    return txt;
  }

  private printPlayerInfo(pinfo) {
    const abiltxt = [
      { val: 6, txt: 'Terribile' },
      { val: 14, txt: 'Pessima' },
      { val: 24, txt: 'Scarsa' },
      { val: 34, txt: 'Discreta' },
      { val: 64, txt: 'Normale' },
      { val: 74, txt: 'Buona' },
      { val: 84, txt: 'Ottima' },
      { val: 94, txt: 'Eccellente' },
      { val: 100, txt: 'Leggendaria' }
    ];

    return '<table><caption>' + pinfo.name + ', ' + pinfo.title + '</caption>'
      + '<tr><th>Descrizione</th><td colspan=3>' + pinfo.desc.replace(/([.:?!,])\s*\n/gm, '$1<p></p>').replace(/\n/gm, ' ') + '</td></tr>'
      + '<tr><th>Razza</th><td>' + pinfo.race.name + '</td><th>Cultura</th><td>' + pinfo.cult + '</td></tr>'
      + '<tr><th>Etnia</th><td>' + pinfo.ethn + '</td><th>Religione</th><td>' + (pinfo.relig ? pinfo.relig : 'nessuna') + '</td></tr>'
      + '<tr><th>Altezza</th><td>' + pinfo.height + ' cm.</td><th>Sesso</th><td>' + pinfo.sex.name + '</td></tr>'
      + '<tr><th>Peso</th><td>'
      + pinfo.weight + ' pietre</td><th>Citt&agrave;</th><td>' + (pinfo.city ? pinfo.city : 'nessuna')
      + '</td></tr>'
      + '<tr><th>Et&agrave;</th><td>' + pinfo.age + ' anni</td><th>Lingua</th><td>' + pinfo.lang + '</td></tr>'
      + '<tr><th>Nascita:</th><td colspan=3>' + pinfo.born + '</td></tr>'
      + '</table><table><caption>Caratteristiche:</caption>'
      + '<tr><td colspan="3"><h4>Mente</h4></td></tr>'
      + '<tr><th>Volontà</th><td>' + pinfo.abil.wil.prc + '</td><td>' + this.prcLowTxt(pinfo.abil.wil.prc, abiltxt) + '</td></tr>'
      + '<tr><th>Intelligenza</th><td>' + pinfo.abil.int.prc + '</td><td>' + this.prcLowTxt(pinfo.abil.int.prc, abiltxt) + '</td></tr>'
      + '<tr><th>Empatia</th><td>' + pinfo.abil.emp.prc + '</td><td>' + this.prcLowTxt(pinfo.abil.emp.prc, abiltxt) + '</td></tr>'
      + '<tr><td colspan="3"><h4>Corpo</h4></td></tr>'
      + '<tr><th>Taglia</th><td>' + pinfo.abil.siz.prc + '</td><td>' + this.prcLowTxt(pinfo.abil.siz.prc, abiltxt) + '</td></tr>'
      + '<tr><th>Forza</th><td>' + pinfo.abil.str.prc + '</td><td>' + this.prcLowTxt(pinfo.abil.str.prc, abiltxt) + '</td></tr>'
      + '<tr><th>Costituzione</th><td>' + pinfo.abil.con.prc + '</td><td>' + this.prcLowTxt(pinfo.abil.con.prc, abiltxt) + '</td></tr>'
      + '<tr><td colspan="3"><h4>Agilità</h4></td></tr>'
      + '<tr><th>Destrezza</th><td>' + pinfo.abil.dex.prc + '</td><td>' + this.prcLowTxt(pinfo.abil.dex.prc, abiltxt) + '</td></tr>'
      + '<tr><th>Velocità</th><td>' + pinfo.abil.spd.prc + '</td><td>' + this.prcLowTxt(pinfo.abil.spd.prc, abiltxt) + '</td></tr>'
      + '</table>';
  }

  private printPlayerStatus(status) {
    let sttxt = '<h4>Condizioni</h4>';

    sttxt += '<p>Salute: ' + status.hit + '</p>';
    sttxt += '<p>Movimento: ' + status.move + '</p>';
    sttxt += '<p>Fame: ' + status.food + '</p>';
    sttxt += '<p>Sete: ' + status.drink + '</p>';

    if (status.msg) {
      sttxt += '<p>' + status.msg + '</p>';
    }

    return sttxt;
  }

  private printDetailsList(cont, type) {
    let res = '';

    if (cont.list) {
      if (cont.title) {
        res += '<p>' + cont.title + '</p>';
      }

      for (let n = 0; n < cont.list.length; n++) {
        const l = cont.list[n];
        res += '<div>' + this.printDecoratedDescription(type, l.condprc, l.mvprc, l.mrn ? l.mrn.length : 0, l.desc) + '</div>';
      }

      if (cont.title && (cont.list.length > 0 || cont.show === true)) {
        res += 'Niente.<br>';
      }
    }

    return res;
  }

  private printDecoratedDescription(type, condprc, moveprc, count, desc) {
    let res = '[' + type[0] + ']&#160;' + desc.replace(/\n/gm, ' ');

    if (condprc || moveprc) {
      res += '&#160;{';
      if (condprc) {
        res += 'pf' + condprc + '%';
      }
      if (moveprc) {
        res += 'mv' + moveprc + '%';
      }
      res += '}';
    }

    if (count > 1) {
      res += '&#160;[x' + count + ']';
    }

    return res;
  }

  private prcLowTxt(val, values) {
    for (let i = 0; i < values.length; ++i) {
      if (val <= values[i].val) {
        return values[i].txt;
      }
    }

    return null;
  }

}
