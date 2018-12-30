import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { DataState } from '../store/state/data.state';
import { IncomingData } from '../store/actions/data.action'; // DA TOGLIERE
import * as DataActions from '../store/actions/data.action'; 
import { GameMode } from '../store/game.const';
import { BehaviorSubject } from 'rxjs';
import { Room } from '../models/message/room.model';

@Injectable({
  providedIn: 'root'
})

export class DataParser {
  private cmdPrefix = '';
  parseUiObject$: BehaviorSubject<any> = new BehaviorSubject([]);

  private msgRegexp = {
    hideInputText: /&x\n*/gm,
    showInputText: /&e\n*/gm,
    updateSkyPicture: /&o.\n*/gm,
  }

  constructor(
    private store: Store<DataState>,
    ) {
    this.parseUiObject$.asObservable();
  }

  parse(data): void {
    this.parseForDisplay(this.preParseText(data));
  }

  preParseText(data: string): string {
    /* Remove -not-tags- */
    data = data.replace(/\r/gm, '');
    data = data.replace(/&!!/gm, '');
    data = data.replace(/\$\$/gm, '$');
    data = data.replace(/%%/gm, '%');
    data = data.replace(/&&/gm, '&#38;');
    data = data.replace(/</gm, '&#60;');
    data = data.replace(/>/gm, '&#62;');

    return data;
  }

  parseForDisplay(data: string) {

    let pos: any;
    const dataState: DataState = {} as DataState;
    dataState.timestamp = new Date().getTime();


    //Hide text (password)
    data = data.replace(this.msgRegexp.hideInputText, (msg) => {
      this.parseUiObject$.next({ data, type: GameMode.HIDEINPUTTEXT });
      return '';
    });

    //Show text (normal input)
    data = data.replace(this.msgRegexp.showInputText, () => {
      this.parseUiObject$.next({ data, type: GameMode.SHOWINPUTTEXT });
      return '';
    });

    // Sky picture
    data = data.replace(this.msgRegexp.updateSkyPicture, (sky) => {
      let sky_parse = sky.charAt(2);
      this.parseUiObject$.next({ sky_parse, type: GameMode.SKYPICTURE });
      return '';
    });

    // Doors Info
    data = data.replace(/&d\d{6}\n*/gm, (doors) => {
      let doors_parse = doors.substr(2, 6);
      this.parseUiObject$.next({ doors_parse, type: GameMode.DOORSINFO });
      return '';
    });

    // Audio
    data = data.replace(/&!au"[^"]*"\n*/gm, (audio) => {
      let audio_parse = audio.slice(5, audio.lastIndexOf('"'));
      this.parseUiObject$.next({ audio_parse, type: GameMode.AUDIO });
      return '';
    });

    // Player status
    data = data.replace(/&!st"[^"]*"\n*/gm, (status) => {
      let status_parse = status.slice(5, status.lastIndexOf('"')).split(',');
      this.parseUiObject$.next({ status_parse, type: GameMode.UPDATE });
      return '';
    });


    // Generic Update Status and more
    data = data.replace(/&!up"[^"]*"\n*/gm, (update) => {
      dataState.type = 'update';
      dataState.info = update.slice(5, status.lastIndexOf('"')).split(',');
      //this.store.dispatch(new DataActions.PlayerStatus(dataState))
      
      return '';
    });

    // Image in side frame (with gamma)
    data = data.replace(/&!img"[^"]*"\n*/gm, (image) => {
      let image_parse = image.slice(6, image.lastIndexOf('"')).split(',');
      this.parseUiObject$.next({ image_parse, type: GameMode.IMAGEWITHGAMMA });
      return '';
    });

    // Image in side frame
    data = data.replace(/&!im"[^"]*"\n*/gm, (image) => {
      let image_parse = image.slice(5, image.lastIndexOf('"'));
      this.parseUiObject$.next({ image_parse, type: GameMode.IMAGE });
      return '';
    });

    // Player is logged in
    data = data.replace(/&!logged"[^"]*"/gm, () => {
      this.parseUiObject$.next({ data, type: GameMode.PLAYERISLOGGEDIN });
      return '';
    });

    // Close the text editor
    data = data.replace(/&!ea"[^"]*"\n*/gm, (options) => {
      this.parseUiObject$.next({ data, type: GameMode.CLOSETEXTEDITOR });
      return '';
    });

    // Open the text editor
    data = data.replace(/&!ed"[^"]*"\n*/gm, (options) => {
      let options_parse = options.slice(5, options.lastIndexOf('"')).split(',');
      let text = options_parse.slice(2).toString().replace(/\n/gm, ' ');
      let text_editor = Object.assign({}, [options_parse, text]);
      this.parseUiObject$.next({ text_editor, type: GameMode.CLOSETEXTEDITOR });
      return '';
    });

    // Map data
    data = data.replace(/&!map\{[\s\S]*?\}!/gm, (map) => {
      let map_parse = JSON.parse(map.slice(5, -1));
      this.parseUiObject$.next({ map_parse, type: GameMode.MAP });
      return '';
    });

    // List of commands
    data = data.replace(/&!cmdlst\{[\s\S]*?\}!/gm, (cmd) => {
      let cmd_parse = JSON.parse(cmd.slice(8, -1).replace(/"""/, '"\\""'));
      this.parseUiObject$.next({ cmd_parse, type: GameMode.MAP });
      return '';
    });

    // Generic page (title, text)
    data = data.replace(/&!page\{[\s\S]*?\}!/gm, (p) => {
      let page_parse = JSON.parse(p.slice(6, -1)); /* .replace(/\n/gm,' ') */
      this.parseUiObject$.next({ page_parse, type: GameMode.RENDERGENERIC });
      return '';
    });

    // Generic table (title, head, data)
    data = data.replace(/&!table\{[\s\S]*?\}!/gm, (t) => {
      let gtable_parse = JSON.parse(t.slice(7, -1));
      this.parseUiObject$.next({ gtable_parse, type: GameMode.RENDERTABLE });
      return '';
    });

    // Inventory
    data = data.replace(/&!inv\{[\s\S]*?\}!/gm, (inv) => {
      let inv_parse = JSON.parse(inv.slice(5, -1));
      this.parseUiObject$.next({ inv_parse, type: GameMode.RENDERINVENTORY });
      return '';
    });

    // Room details
    data = data.replace(/&!room\{[\s\S]*?\}!/gm, (dtls) => {
      dtls = JSON.parse(dtls.slice(6, -1)) ;
      this.store.dispatch(new DataActions.RoomAction(dtls));
      return '';
    });

    // Person details
    data = data.replace(/&!pers\{[\s\S]*?\}!/gm, (dtls) => {
      let dtls_parse = JSON.parse(dtls.slice(6, -1));
      this.parseUiObject$.next({ dtls_parse, type: GameMode.PERSONDETAILS });
      return '';
    });

    // Object details
    data = data.replace(/&!obj\{[\s\S]*?\}!/gm, (dtls) => {
      let dtls_parse = JSON.parse(dtls.slice(5, -1).replace(/\n/gm, ' '));
      this.parseUiObject$.next({ dtls_parse, type: GameMode.OBJECTDETAILS });
      return '';
    });

    // Equipment
    data = data.replace(/&!equip\{[\s\S]*?\}!/gm, (eq) => {
      let eq_parse = JSON.parse(eq.slice(7, -1).replace(/\n/gm, '<br>'));
      this.parseUiObject$.next({ eq_parse, type: GameMode.EQUIP });
      return '';
    });

    // Workable lists
    data = data.replace(/&!wklst\{[\s\S]*?\}!/gm, (wk) => {
      let wk_parse = JSON.parse(wk.slice(7, -1));
      this.parseUiObject$.next({ wk_parse, type: GameMode.WORKABLELIST });
      return '';
    });

    // Skill list
    data = data.replace(/&!sklst\{[\s\S]*?\}!/gm, (skinfo) => {
      let skinfo_parse = JSON.parse(skinfo.slice(7, -1));
      this.parseUiObject$.next({ skinfo_parse, type: GameMode.SKILLS });
      return '';

    });

    // Player info
    data = data.replace(/&!pginf\{[\s\S]*?\}!/gm, (info) => {
      let info_parse = JSON.parse(info.slice(7, -1));
      this.parseUiObject$.next({ info_parse, type: GameMode.PLAYERINFO });
      return '';
    });

    // Player status
    data = data.replace(/&!pgst\{[\s\S]*?\}!/gm, (status) => {
      let status_parse = JSON.parse(status.slice(6, -1));
      this.parseUiObject$.next({ status_parse, type: GameMode.PLAYERSTATUS });
      return '';
    });

    // (New) Image Request Box
    data = data.replace(/&!imgreq\{[\s\S]*?\}!/gm, (imgreq) => {
      imgreq = JSON.parse(imgreq.slice())
      this.parseUiObject$.next({ imgreq, type: GameMode.NEWIMAGEREQUEST });
      return '';
    });

    // Selectable generic
    data = data.replace(/&!select\{[\s\S]*?\}!/gm, (s) => {
      s = JSON.parse(s.slice(8, -1));
      this.parseUiObject$.next({ s, type: GameMode.SELECTABLEGENERIC });
      return '';
    });

    // Refresh command
    data = data.replace(/&!refresh\{[\s\S]*?\}!/gm, (t) => {
      let rcommand_parse = JSON.parse(t.slice(9, -1));
      this.parseUiObject$.next({ rcommand_parse, type: GameMode.REFRESH });
      return '';
    });

    // Pause scroll
    data = data.replace(/&!crlf"[^"]*"/gm, () => {
      this.parseUiObject$.next({ type: GameMode.PAUSESCROLL });
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
      let image_parse = image.slice(5, -1);
      console.log('renderEmbeddedImage');
      return '';
      //return renderEmbeddedImage(image_parse);
    });

    data = data.replace(/&!ulink"[^"]*"/gm, (link) => {
      let link_parse = link.slice(8, -1).split(',');
      // return _.renderLink(link_parse[0], link_parse[1]);
      return '';
    });

    data = data.replace(/&!as"[^"]*"/gm, '');

    data = data.replace(/&!(ad|a)?m"[^"]*"/gm, (mob) => {
      let mob_parse = mob.slice(mob.indexOf('"') + 1, -1).split(',');
      let desc_parse = mob.slice(5).toString();
      // return _.renderMob(mob_parse[0], mob_parse[1], mob_parse[2], mob_parse[3], desc_parse, 'interact pers');
      return '';
    });

    data = data.replace(/&!(ad|a)?o"[^"]*"/gm, (obj) => {
      let obj_parse = obj.slice(obj.indexOf('"') + 1, -1).split(',');
      let desc_parse = obj.slice(5).toString();
      // return _.renderObject(obj_parse[0], obj_parse[1], obj_parse[2], obj_parse[3], desc_parse, 'interact obj');
      return '';
    });

    data = data.replace(/&!sm"[^"]*"/gm, (icon) => {
      let icon_parse = icon.slice(5, -1).split(',');
      // return _.renderIcon(icon_parse[0], icon_parse[1], 'room', null, null, 'interact pers');
      return '';
    });

    data = data.replace(/&!si"[^"]*"/gm, (icon) => {
      let icon_parse = icon.slice(5, -1).split(',');
      // return _.renderIcon(icon_parse[0], null, null, null, null, "v" + icon_parse[1]);
      return '';
    });

    data = data.replace(/&i/gm, function () {
      // _.isGod = true;
      return '';
    });

    data = data.replace(/&I\d/gm, function (inv) {
      // _.godInvLev = parseInt(inv.substr(2, 3));
      return '';
    });

    /* \r is already removed at top */
    data = data.replace(/\n/gm, '<br>');

    if (data != 'undefined' && data != '') {
      data = this.replaceColors(data);
      dataState.type = 'default';
      dataState.info = data.replace(/<p><\/p>/g, '');
      this.store.dispatch(new IncomingData(dataState));
      // this.parseSubject.next(data);
    }
  }

  replaceColors(data) {
    data = data.replace(/&B/gm, '<span class="tg-gray">');
    data = data.replace(/&R/gm, '<span class="tg-lt-red">');
    data = data.replace(/&G/gm, '<span class="tg-lt-green">');
    data = data.replace(/&Y/gm, '<span class="tg-yellow">');
    data = data.replace(/&L/gm, '<span class="tg-lt-blue">');
    data = data.replace(/&M/gm, '<span class="tg-lt-magenta">');
    data = data.replace(/&C/gm, '<span class="tg-lt-cyan">');
    data = data.replace(/&W/gm, '<span class="tg-white">');
    data = data.replace(/&b/gm, '<span class="tg-black">');
    data = data.replace(/&r/gm, '<span class="tg-red">');
    data = data.replace(/&g/gm, '<span class="tg-green">');
    data = data.replace(/&y/gm, '<span class="tg-brown">');
    data = data.replace(/&l/gm, '<span class="tg-blue">');
    data = data.replace(/&m/gm, '<span class="tg-magenta">');
    data = data.replace(/&c/gm, '<span class="tg-cyan">');
    data = data.replace(/&w/gm, '<span class="tg-lt-white">');
    data = data.replace(/&-/gm, '</span>');

    return data;
  }

  removeColors(data) {
    return data.replace(/&[BRGYLMCWbrgylmcw-]/gm, '');
  }

  parseInput(input): any {
    /* Split input separated by ; */
    let inputs = input.split(/\s*;\s*/);
    let res = [];
    /* Substitute shortcuts on each command and join results */
    for (let i = 0; i < inputs.length; ++i) {
      let subs = this.substShort(inputs[i]).split(/\s*;\s*/);
      res = res.concat(subs);
    }
    /* Return the resulting array */
    return res;
  }

  substShort(input) {

    let _ = this;
    /* Split into arguments */
    let args = input.split(/\s+/);

    /* Get the shortcut index */
    let shortcut_key = args.shift();
    let shortcut_num = parseInt(shortcut_key);
    let shortcut_cmd;
    if (!isNaN(shortcut_num)) {
      //shortcut_cmd = _.client_options.shortcuts[shortcut_num];
      //} else if (typeof (_.shortcuts_map[shortcut_key]) != 'undefined') {
      //shortcut_cmd = _.client_options.shortcuts[_.shortcuts_map[shortcut_key]];
    }

    /* Check if the shortcut is defined */
    if (shortcut_cmd) {
      /* Use the shortcut text as command */
      input = shortcut_cmd.cmd;
      if (/\$\d+/.test(input)) {
        /* Substitute the arguments */
        for (let arg = 0; arg < args.length; ++arg) {
          let rx = new RegExp("\\$" + (arg + 1), 'g');
          input = input.replace(rx, args[arg]);
        }
        /* Remove remaining letiables */
        input = input.replace(/\$\d+/g, '');
      } else
        input += " " + args.join(" ");
    }

    if (this.cmdPrefix.length > 0) {
      input = this.cmdPrefix + " " + input;
    }
    return input;
  }

}
