import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { State } from '../store';
import * as DataActions from '../store/actions/data.action';
import * as GameActions from '../store/actions/client.action';

import { IHero } from '../models/data/hero.model';
import { Observable, Subject } from 'rxjs';
import { LogService } from './log.service';
import { TGConfig } from '../main/client/client-config';
import { ConfigService } from './config.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class DataParser {

  tgConfig: TGConfig

  private dispatcher: any = {};
  private netData = '';

  private shortcuts = [];
  private shortcuts_map = {};
  private cmd_prefix = '';

  private _updateNeeded: Subject<any>;

  constructor(
    private store: Store<State>,
    private _configService: ConfigService,
    private logService: LogService
  ) {

    this._updateNeeded = new Subject<any>();

    //Subscribe to the shortcuts in Config
    this._configService.getConfig()
      .pipe(map((config: TGConfig) => { return config.shortcuts }))
      .subscribe((shortcuts) => { this.shortcuts = shortcuts; }
      )
  }

  handlerGameData(data: any, logEnabled?: boolean) {

    this.netData += data;
    const len = this.netData.length;

    if (this.netData.indexOf('&!!', len - 3) !== -1) {

      data = this.preParseText(this.netData.substr(0, len - 3));

      try {
        this.parseForDisplay(data);
      } catch (err) {
        console.log(err.message);
      }


      if (logEnabled) {

        try {
          this.logService.parseForLog(data);
        } catch (err) {
          console.log(err.message);
        }
      }

      this.netData = '';

    } else if (len > 200000) {
      this.netData = '';
      this.store.dispatch(new GameActions.DisconnectAction);
    }
  }

  preParseText(data: string): string {
    data = data.replace(/\r/gm, '');
    data = data.replace(/&!!/gm, '');
    data = data.replace(/\$\$/gm, '$');
    data = data.replace(/%%/gm, '%');
    data = data.replace(/&&/gm, '&#38;');
    data = data.replace(/</gm, '&#60;');
    data = data.replace(/>/gm, '&#62;');
    return data;
  }

  parseForDisplay(data: string): void {

    // reset Dispatcher
    this.dispatcher = {};

    let pos: any;


    // Player is logged in
    data = data.replace(/&!logged"[^"]*"/gm, () => {
      this.store.dispatch(new GameActions.InGameAction());
      return '';
    });

    // News
    data = data.replace(/&!news\{[\s\S]*?\}!/gm, (msg) => {
      this.store.dispatch(new GameActions.NewsAction);
      return '';
    });

    // Character base Data
    data = data.replace(/&!pgdata\{[\s\S]*?\}!/gm, (pgdata) => {
      const pgdata_parse = JSON.parse(pgdata.slice(8, -1));
      this.store.dispatch(new DataActions.HeroAction(<IHero>pgdata_parse));
      return '';
    });

    // Data Time
    data = data.replace(/&!datetime\{[\s\S]*?\}!/gm, (time) => {
      const parse_time = JSON.parse(time.slice(10, -1));
      this.store.dispatch(new DataActions.DateTimeAction(parse_time));
      return '';
    });

    // Region

    data = data.replace(/&!region\{[\s\S]*?\}!/gm, (region) => {
      const region_parse = JSON.parse(region.slice(8, -1));
      this.store.dispatch(new DataActions.RegionAction(region_parse));
      return '';
    });

    /* *
     * DEPRECATED
     * Hide text (password) */
    data = data.replace(/&x\n*/gm, (msg) => {
      this.store.dispatch(new GameActions.UpdateUI({ inputVisible: false }));
      return '';
    });

    /* *
     * DEPRECATED(normal input)
     * */
    data = data.replace(/&e\n*/gm, () => {
      this.store.dispatch(new GameActions.UpdateUI({ inputVisible: true }));
      return '';
    });

    // Sky picture
    data = data.replace(/&o.\n*/gm, (sky) => {
      const sky_parse = sky.charAt(2);
      this.store.dispatch(new DataActions.SkyAction(sky_parse));
      return '';
    });

    // Doors Info
    data = data.replace(/&d\d{6}\n*/gm, (doors) => {
      const doors_parse = doors.substr(2, 6);
      this.store.dispatch(new DataActions.DoorsAction(doors_parse));
      return '';
    });

    // Audio
    data = data.replace(/&!au"[^"]*"\n*/gm, (audio) => {
      const audio_parse = audio.slice(5, audio.lastIndexOf('"'));
      this.store.dispatch(new GameActions.AudioAction(audio_parse));
      return '';
    });

    // Auto Update Hero Status
    data = data.replace(/&!st\{[\s\S]*?\}!/gm, (status) => {
      const status_parse = JSON.parse(status.slice(4, -1));
      this.store.dispatch(new DataActions.UpdateStatusHero(status_parse));
      return '';
    });

    // Generic Update for Client Status and more
    data = data.replace(/&!up"[^"]*"\n*/gm, (update) => {
      const ud = update.slice(5, status.lastIndexOf('"')).split(',');
      this.dispatcher.update = ud;
      return '';
    });

    /**DEPRECATED
     * Image in side frame (with gamma)*/
    data = data.replace(/&!img"[^"]*"\n*/gm, (image) => {
      const image_parse = image.slice(6, image.lastIndexOf('"')).split(',');
      console.log('image in side frame with gamma:', image_parse);
      return '';
    });

    // Image in side frame
    data = data.replace(/&!im"[^"]*"\n*/gm, (image) => {
      const image_parse = image.slice(5, image.lastIndexOf('"'));
      console.log('image in side frame', image_parse);
      return '';
    });

    // Close the text editor
    data = data.replace(/&!ea"[^"]*"\n*/gm, (options) => {
      this.store.dispatch(new GameActions.CloseTextEditor());
      return '';
    });

    // Open the text editor
    data = data.replace(/&!ed"[^"]*"\n*/gm, (options) => {
      const options_parse = options.slice(5, options.lastIndexOf('"')).split(',');
      const text = options_parse.slice(2).toString().replace(/\n/gm, ' ');
      this.store.dispatch(new DataActions.EditorAction({
        maxChars: options_parse[0],
        title: options_parse[1] ? options_parse[1] : ' ',
        description: text ? text : ' '
      }));
      return '';
    });

    // Map data
    data = data.replace(/&!map\{[\s\S]*?\}!/gm, (map) => {
      const map_parse = JSON.parse(map.slice(5, -1));
      this.store.dispatch(new DataActions.MapAction(map_parse));
      return '';
    });

    // Book
    data = data.replace(/&!book\{[\s\S]*?\}!/gm, (book) => {
      const b_parse = JSON.parse(book.slice(6, -1));
      this.store.dispatch(new DataActions.BookAction(b_parse));
      return '';
    });

    // List of commands
    data = data.replace(/&!cmdlst\{[\s\S]*?\}!/gm, (cmd) => {
      const cmd_parse = JSON.parse(cmd.slice(8, -1).replace(/"""/, '"\\""'));
      this.store.dispatch(new GameActions.ShowCommandsActions(cmd_parse));
      return '';
    });

    // Generic page (title, text)
    data = data.replace(/&!page\{[\s\S]*?\}!/gm, (p) => {
      const page_parse = JSON.parse(p.slice(6, -1)); /* .replace(/\n/gm,' ') */
      this.store.dispatch(new DataActions.GenericPageAction(page_parse));
      return '';
    });

    // Generic table (title, head, data)
    data = data.replace(/&!table\{[\s\S]*?\}!/gm, (t) => {
      const gtable_parse = JSON.parse(t.slice(7, -1));
      this.store.dispatch(new DataActions.GenericTableAction(gtable_parse));
      return '';
    });

    // Inventory
    data = data.replace(/&!inv\{[\s\S]*?\}!/gm, (inv) => {
      const inv_parse = JSON.parse(inv.slice(5, -1));
      this.store.dispatch(new DataActions.InventoryAction(inv_parse));
      return '';
    });

    // Room details
    data = data.replace(/&!room\{[\s\S]*?\}!/gm, (dtls) => {
      this.dispatcher.room = JSON.parse(dtls.slice(6, -1));
      return '';
    });

    // Person details
    data = data.replace(/&!pers\{[\s\S]*?\}!/gm, (dtls) => {
      this.dispatcher.pers = JSON.parse(dtls.slice(6, -1));
      return '';
    });

    // Object details
    data = data.replace(/&!obj\{[\s\S]*?\}!/gm, (dtls) => {
      this.dispatcher.objpers = JSON.parse(dtls.slice(5, -1).replace(/\n/gm, ' '));
      return '';
    });

    // Equipment
    data = data.replace(/&!equip\{[\s\S]*?\}!/gm, (eq) => {
      const eq_parse = JSON.parse(eq.slice(7, -1).replace(/\n/gm, '<br>'));
      this.store.dispatch(new DataActions.EquipAction(eq_parse));
      return '';
    });

    // Workable lists
    data = data.replace(/&!wklst\{[\s\S]*?\}!/gm, (wk) => {
      const wk_parse = JSON.parse(wk.slice(7, -1));
      this.store.dispatch(new DataActions.WorksListAction(wk_parse));
      return '';
    });

    // Skill list
    data = data.replace(/&!sklst\{[\s\S]*?\}!/gm, (skinfo) => {
      const skinfo_parse = JSON.parse(skinfo.slice(7, -1));
      this.store.dispatch(new DataActions.SkillsAction(skinfo_parse));
      return '';

    });

    // Player info
    data = data.replace(/&!pginf\{[\s\S]*?\}!/gm, (info) => {
      const info_parse = JSON.parse(info.slice(7, -1));
      this.store.dispatch(new GameActions.ShowCharacterSheetActions([info_parse, 'info']));
      return '';
    });

    // Player status INLINE
    data = data.replace(/&!pgst\{[\s\S]*?\}!/gm, (status) => {
      const status_parse = JSON.parse(status.slice(6, -1));
      this.store.dispatch(new GameActions.ShowStatusBoxAction({ status: status_parse }));
      return '';
    });

    // // (New) Image Request Box
    // data = data.replace(/&!imgreq\{[\s\S]*?\}!/gm, (imgreq) => {
    //   imgreq = JSON.parse(imgreq.slice());
    //   this.parseUiObject$.next({ imgreq, type: GameMode.NEWIMAGEREQUEST });
    //   return '';
    // });

    // Selectable generic
    data = data.replace(/&!select\{[\s\S]*?\}!/gm, (s) => {
      s = JSON.parse(s.slice(8, -1));
      console.log('selectable generic', s);
      return '';
    });

    // Refresh command
    data = data.replace(/&!refresh\{[\s\S]*?\}!/gm, (t) => {
      const rcommand_parse = JSON.parse(t.slice(9, -1));
      this.store.dispatch(new GameActions.RefreshCommandAction());
      console.log('refresh command', rcommand_parse);
      return '';
    });

    // Pause scroll
    data = data.replace(/&!crlf"[^"]*"/gm, () => {
      // console.log('pause scroll?');
      return '';
    });

    // Clear message
    pos = data.lastIndexOf('&*');
    if (pos >= 0) {
      data = data.slice(pos + 2);
    }

    // Filterable messages
    data = data.replace(/&!m"(.*)"\{([\s\S]*?)\}!/gm, (line, type, msg) => {
      console.log('addFilterTag');
      return '';
    });

    data = data.replace(/&!ce"[^"]*"/gm, (image) => {
      const image_parse = image.slice(5, -1);
      console.log('renderEmbeddedImage', image_parse);
      return '';
      // return renderEmbeddedImage(image_parse);
    });

    data = data.replace(/&!ulink"[^"]*"/gm, (link) => {
      const link_parse = link.slice(8, -1).split(',');
      console.log('render link', link_parse);
      // return _.renderLink(link_parse[0], link_parse[1]);
      return '';
    });

    data = data.replace(/&!as"[^"]*"/gm, '');

    data = data.replace(/&!(ad|a)?m"[^"]*"/gm, (mob) => {
      const mob_parse = mob.slice(mob.indexOf('"') + 1, -1).split(',');
      const desc_parse = mob.slice(5).toString();

      console.log('render mob..?', mob_parse, desc_parse);
      // return _.renderMob(mob_parse[0], mob_parse[1], mob_parse[2], mob_parse[3], desc_parse, 'interact pers');
      return '';
    });

    data = data.replace(/&!(ad|a)?o"[^"]*"/gm, (obj) => {
      const obj_parse = obj.slice(obj.indexOf('"') + 1, -1).split(',');
      const desc_parse = obj.slice(5).toString();
      console.log('render object...?', obj_parse, desc_parse);
      // return _.renderObject(obj_parse[0], obj_parse[1], obj_parse[2], obj_parse[3], desc_parse, 'interact obj');
      return '';
    });

    // Is God
    data = data.replace(/&i/gm, () => {
      this.dispatcher.isgod = true;
      return '';
    });

    // Invisibility Level (only god);
    data = data.replace(/&I\d/gm, (inv) => {
      this.dispatcher.visibilLevel = parseInt(inv.substr(2, 3), 10);
      return '';
    });

    /* \r is already removed at top */

    if (data !== 'undefined' && data !== undefined && data !== '') {
      data = data.replace(/\n/gm, '<div class="breakline"></div>');
      data = data.replace(/<p><\/p>/g, '');
      this.dispatcher['base'] = data;
    }


    // Execute
    if (Object.keys(this.dispatcher).length > 0) {
      this.dispatchData();
    }
  }

  // Emit data Stored in the dispatcher to show then in the right Output Order
  dispatchData() {
    // Output Messages
    if (this.dispatcher['base']) { this.store.dispatch(new DataActions.IncomingData(this.dispatcher['base'])); }
    if (this.dispatcher['objpers']) { this.store.dispatch(new DataActions.ObjAndPersAction(this.dispatcher['objpers'])); }
    if (this.dispatcher['room']) { this.store.dispatch(new DataActions.RoomAction(this.dispatcher['room'])); }
    if (this.dispatcher['pers']) { this.store.dispatch(new DataActions.ObjAndPersAction(this.dispatcher['pers'])); }
    // TODO UI (dont need order) :
    if (this.dispatcher['visibilLevel']) { this.store.dispatch(new GameActions.UpdateUI({ invLevel: this.dispatcher['visibilLevel'] })); };
    if (this.dispatcher['isgod']) { this.store.dispatch(new GameActions.UpdateUI({ isGod: this.dispatcher['isgod'] })); }
    if (this.dispatcher['update']) { this.setUpdateNeeded(this.dispatcher['update']) }
  }


  removeColors(data: any) {
    return data.replace(/&[BRGYLMCWbrgylmcw-]/gm, '');
  }

  parseInput(input: any): any {
    /* Split input separated by ; */
    const inputs = input.split(/\s*;\s*/);
    let res = [];
    /* Substitute shortcuts on each command and join results */
    for (let i = 0; i < inputs.length; ++i) {
      const subs = this.substShort(inputs[i]).split(/\s*;\s*/);
      res = res.concat(subs);
    }
    /* Return the resulting array */
    return res;
  }


  substShort(input: any): any {

    /* Split into arguments */

    const args = input.split(/\s+/);
    /* Get the shortcut index */
    const shortcut_key = args.shift();
    const shortcut_num = parseInt(shortcut_key, 10);

    let shortcut_cmd: any;

    if (!isNaN(shortcut_num)) {
      shortcut_cmd = this.shortcuts[shortcut_num];
    } else {
      shortcut_cmd = this.shortcuts.filter(x => x.alias === shortcut_key)[0];
    }

    /* Check if the shortcut is defined */
    if (shortcut_cmd) {
      /* Use the shortcut text as command */
      input = shortcut_cmd['cmd'];

      if (/\$\d+/.test(input)) {
        /* Substitute the arguments */
        for (let arg = 0; arg < args.length; ++arg) {
          const rx = new RegExp('\\$' + (arg + 1), 'g');
          input = input.replace(rx, args[arg]);
        }

        /* Remove remaining letiables */
        input = input.replace(/\$\d+/g, '');
      } else {
        input += ' ' + args.join(' ');
      }
    }


    if (this.cmd_prefix.length > 0) {
      input = this.cmd_prefix + ' ' + input;
    }

    return input;
  }

  setUpdateNeeded(ud: any) {
    this._updateNeeded.next(ud);
  }

  get updateNeeded(): Observable<any> {
    return this._updateNeeded.asObservable();
  }
}
