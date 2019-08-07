import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { TGState } from '../store';
import * as DataActions from '../store/actions/data.action';
import * as GameActions from '../store/actions/client.action';

import { Observable, Subject } from 'rxjs';
import { LogService } from './log.service';
import { TGConfig } from '../client-config';
import { ConfigService } from '../../../services/config.service';
import { map } from 'rxjs/operators';
import { Map } from '../models/data/map.model';

@Injectable()

export class DataParser {

  tgConfig: TGConfig;

  private dispatcher: any = {};
  private netData = '';
  private shortcuts = [];
  // private shortcuts_map = {};
  private cmd_prefix = '';
  private _updateNeeded: Subject<any>;

  constructor(
    private store: Store<TGState>,
    private _configService: ConfigService,
    private logService: LogService
  ) {

    this._updateNeeded = new Subject<any>();
    // Subscribe to the shortcuts in Config
    this._configService.getConfig()
      .pipe(map((config: TGConfig) => config.shortcuts))
      .subscribe((shortcuts) => { this.shortcuts = shortcuts; }
      );
  }

  parse(data: any, logEnabled?: boolean) {

    this.netData += data;
    const len = this.netData.length;

    if (this.netData.indexOf('&!!', len - 3) !== -1) {

      data = this.preParseText(this.netData.substr(0, len - 3));

      try {
        this.parseForDisplay(data);
      } catch (err) {
        console.error(err);
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
      this.store.dispatch(GameActions.disconnectAction);
    }
  }

     
  private preParseText(data: string): string {
    data = data.replace(/\r/gm, '');
    data = data.replace(/&!!/gm, '');
    data = data.replace(/\$\$/gm, '$');
    data = data.replace(/%%/gm, '%');
    data = data.replace(/&&/gm, '&#38;');
    data = data.replace(/</gm, '&#60;');
    data = data.replace(/>/gm, '&#62;');
    return data;
  }


  private parseForDisplay(data: string): void {
    

    // reset Dispatcher
    this.dispatcher = {};
    let pos: any;

    data = data.replace(/&!logged"[^"]*"/gm, this.logged.bind(this));
    data = data.replace(/&!news\{[\s\S]*?\}!/gm, this.news.bind(this));
    data = data.replace(/&!pgdata\{[\s\S]*?\}!/gm, this.characterData.bind(this));
    data = data.replace(/&!datetime\{[\s\S]*?\}!/gm, this.dateTime.bind(this));
    data = data.replace(/&!region\{[\s\S]*?\}!/gm, this.region.bind(this));
    data = data.replace(/&x\n*/gm, this.hideInputChars.bind(this));
    data = data.replace(/&e\n*/gm, this.showInputChars.bind(this));
    data = data.replace(/&o.\n*/gm, this.skyPicture.bind(this));
    data = data.replace(/&d\d{6}\n*/gm, this.doors.bind(this));
    data = data.replace(/&!au"[^"]*"\n*/gm, this.audio.bind(this));
    data = data.replace(/&!st\{[\s\S]*?\}!/gm, this.updateHeroStatus.bind(this));
    data = data.replace(/&!up"[^"]*"\n*/gm,  this.clientUpdate.bind(this));
    data = data.replace(/&!img"[^"]*"\n*/gm, this.imageInSideFrameWithGamma.bind(this));
    data = data.replace(/&!im"[^"]*"\n*/gm, this.imageInSideFrame.bind(this));
    data = data.replace(/&!ea"[^"]*"\n*/gm, this.closeTextEditor.bind(this));
    data = data.replace(/&!ed"[^"]*"\n*/gm, this.openTextEditorWithData.bind(this));
    data = data.replace(/&!map\{[\s\S]*?\}!/gm, this.map.bind(this));
    data = data.replace(/&!book\{[\s\S]*?\}!/gm, this.book.bind(this));
    data = data.replace(/&!cmdlst\{[\s\S]*?\}!/gm, this.listOfCommands.bind(this));
    data = data.replace(/&!page\{[\s\S]*?\}!/gm, this.genericPage.bind(this));
    data = data.replace(/&!table\{[\s\S]*?\}!/gm, this.genericTable.bind(this));
    data = data.replace(/&!inv\{[\s\S]*?\}!/gm, this.inventory.bind(this));
    data = data.replace(/&!room\{[\s\S]*?\}!/gm, this.roomDetails.bind(this));
    data = data.replace(/&!pers\{[\s\S]*?\}!/gm, this.personDetails.bind(this));
    data = data.replace(/&!obj\{[\s\S]*?\}!/gm, this.objectDetails.bind(this));
    data = data.replace(/&!equip\{[\s\S]*?\}!/gm, this.equipment.bind(this));
    data = data.replace(/&!wklst\{[\s\S]*?\}!/gm, this.workableList.bind(this));
    data = data.replace(/&!sklst\{[\s\S]*?\}!/gm, this.skillList.bind(this));
    data = data.replace(/&!pginf\{[\s\S]*?\}!/gm, this.playerInfo.bind(this));
    data = data.replace(/&!pgst\{[\s\S]*?\}!/gm, this.playerStatusInline.bind(this));
    data = data.replace(/&!select\{[\s\S]*?\}!/gm, this.selectableGeneric.bind(this));
    data = data.replace(/&!refresh\{[\s\S]*?\}!/gm, this.refreshCommand.bind(this));
    data = data.replace(/&!crlf"[^"]*"/gm, this.pauseScrollRequested.bind(this));

    // Clear message
    pos = data.lastIndexOf('&*');
    if (pos >= 0) {
      data = data.slice(pos + 2);
    }

    data = data.replace(/&!m"(.*)"\{([\s\S]*?)\}!/gm, this.filterableMessage.bind(this));
    data = data.replace(/&!ce"[^"]*"/gm, this.embeddedImage.bind(this));
    data = data.replace(/&!ulink"[^"]*"/gm, this.textLink.bind(this));
    data = data.replace(/&!as"[^"]*"/gm, '');
    data = data.replace(/&!(ad|a)?m"[^"]*"/gm, this.renderMob.bind(this));
    data = data.replace(/&!(ad|a)?o"[^"]*"/gm, this.renderObject.bind(this));
    data = data.replace(/&i/gm, this.isGod.bind(this));
    data = data.replace(/&I\d/gm, this.invisibilityLevel.bind(this));

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
  private dispatchData() {
    // Output Messages
    if (this.dispatcher['base']) { this.store.dispatch(DataActions.incomingData({ payload: this.dispatcher['base'] })); }
    if (this.dispatcher['objpers']) { this.store.dispatch(DataActions.objectAndPersonAction({ payload: this.dispatcher['objpers'] })); }
    if (this.dispatcher['room']) { this.store.dispatch(DataActions.roomAction({ payload: this.dispatcher['room'] })); }
    if (this.dispatcher['pers']) { this.store.dispatch(DataActions.objectAndPersonAction({ payload: this.dispatcher['pers'] })); }
    // TODO UI (dont need order) :
    if (this.dispatcher['visibilLevel']) {
      this.store.dispatch(GameActions.updateUIAction({ payload: { invLevel: this.dispatcher['visibilLevel'] } }));
    }
    if (this.dispatcher['isgod']) { this.store.dispatch(GameActions.updateUIAction({ payload: { isGod: this.dispatcher['isgod'] } })); }
    if (this.dispatcher['update']) { this.setUpdateNeeded(this.dispatcher['update']); }
  }

  private substShort(input: any): any {

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

  setUpdateNeeded(ud: any) {
    this._updateNeeded.next(ud);
  }

  getUpdateNeeded(): Observable<any> {
    return this._updateNeeded.asObservable();
  }


  /** PARSERS LIST---------------------------------------------------- */

  private logged(): string {
    return '';
    this.store.dispatch(GameActions.inGameAction());
    return '';
  }

  private news( data: any): string {
    this.store.dispatch(GameActions.inGameAction());
    return '';
  }

  private characterData(data: any): string {
    const pgdata_parse = JSON.parse(data.slice(8, -1));
    this.store.dispatch(DataActions.heroAction({ payload: pgdata_parse }));
    return '';
  }

  private dateTime(data: any): string {
    const parse_time = JSON.parse(data.slice(10, -1));
    this.store.dispatch( DataActions.dataTimeAction({payload: parse_time}));
    return '';
  }

  private region(data): string  {
    const region_parse = JSON.parse(data.slice(8, -1));
    this.store.dispatch(DataActions.regionAction({ payload: region_parse}));
    return '';
  }
  
  private hideInputChars(): string {
    this.store.dispatch(GameActions.updateUIAction({ payload: {inputVisible: false }}));
    return '';
  }

  private showInputChars(): string {
    this.store.dispatch(GameActions.updateUIAction({ payload: {inputVisible: true }}));
    return '';
  }

  private skyPicture(sky: string): string {
    const sky_parse = sky.charAt(2);
    this.store.dispatch(DataActions.skyAction({ payload: sky_parse }));
    return '';
  }

  private doors(doors): string {
    const doors_parse = doors.substr(2, 6);
    this.store.dispatch(DataActions.doorsAction({ payload: doors_parse }));
    return '';
  }

  private audio(audio): string {
    const audio_parse = audio.slice(5, audio.lastIndexOf('"'));
    this.store.dispatch(GameActions.audioAction({payload: audio_parse}));
    return '';
  }

  private updateHeroStatus(status): string {
    const status_parse = JSON.parse(status.slice(4, -1));
    this.store.dispatch(DataActions.updateStatusHero({ payload: status_parse }));
    return '';
  }

  private clientUpdate(up): string {
    const ud = up.slice(5, status.lastIndexOf('"')).split(',');
    this.dispatcher.update = ud;
    return '';
  }

  private imageInSideFrameWithGamma(image: any): string {
    const image_parse = image.slice(6, image.lastIndexOf('"')).split(',');
    console.log('image in side frame with gamma:', image_parse);
    return '';
  }

  private imageInSideFrame(image: any): string {
    const image_parse = image.slice(5, image.lastIndexOf('"'));
    console.log('image in side frame', image_parse);
    return '';
  }

  private closeTextEditor(options?: any): string{
    this.store.dispatch( DataActions.closeTextEditorAction());
    return '';
  }

  private openTextEditorWithData(data: any): string {
    const options_parse = data.slice(5, data.lastIndexOf('"')).split(',');
    const text = options_parse.slice(2).toString().replace(/\n/gm, ' ');
    this.store.dispatch(DataActions.editorAction({
      payload: {
        maxChars: options_parse[0],
        title: options_parse[1] ? options_parse[1] : ' ',
        description: text ? text : ' '
      }
    }));
    return '';
  }

  private map(m: any): string {
    const map_parse = <Map>JSON.parse(m.slice(5, -1));
    this.store.dispatch(DataActions.mapAction({ map: map_parse }));
    return '';
  }

  private book(book: any): string {
    const b_parse = JSON.parse(book.slice(6, -1));
    this.store.dispatch(DataActions.bookAction(b_parse));
    return '';
  }

  private listOfCommands(cmds: any): string {
    const cmd_parse = JSON.parse(cmds.slice(8, -1).replace(/"""/, '"\\""'));
    this.store.dispatch( DataActions.showCommandsActions({payload: cmd_parse}));
    return '';
  }

  private genericPage(p: any): string {
    const page_parse = JSON.parse(p.slice(6, -1)); /* .replace(/\n/gm,' ') */
    this.store.dispatch(DataActions.genericPageAction({ payload: page_parse }));
    return '';
  }

  private genericTable(t: any): string {
    const gtable_parse = JSON.parse(t.slice(7, -1));
    this.store.dispatch(DataActions.genericTableAction({ payload: gtable_parse }));
    return '';
  }

  private inventory(inv: any): string {
    const inv_parse = JSON.parse(inv.slice(5, -1));
    this.store.dispatch(DataActions.inventoryAction({ payload: inv_parse }));
    return '';
  }

  private equipment(eq: any): string {
    const eq_parse = JSON.parse(eq.slice(7, -1).replace(/\n/gm, '<br>'));
    this.store.dispatch(DataActions.equipAction({ payload: eq_parse }));
    return '';
  }

  private roomDetails(dtls: any): string {
    this.dispatcher.room = JSON.parse(dtls.slice(6, -1));
    return '';
  }

  private personDetails(dtls: any): string {
    this.dispatcher.pers = JSON.parse(dtls.slice(6, -1));
    return '';
  }

  private objectDetails(dtls: any): string {
    this.dispatcher.objpers = JSON.parse(dtls.slice(5, -1).replace(/\n/gm, ' '));
    return '';
  }

  private workableList(wk: any): string {
    const wk_parse = JSON.parse(wk.slice(7, -1));
    this.store.dispatch(DataActions.worksListAction({ payload: wk_parse }));
    return '';
  }

  private skillList(skinfo: any): string {
    const skinfo_parse = JSON.parse(skinfo.slice(7, -1));
    this.store.dispatch(DataActions.skillsAction({ payload: skinfo_parse }));
    return '';
  }

  private playerInfo(info: any): string {
    const info_parse = JSON.parse(info.slice(7, -1));
    this.store.dispatch( DataActions.showCharacterSheetActions({payload: [info_parse, 'info']}));
    return '';
  }
  private playerStatusInline(data: any): string {
    const status_parse = JSON.parse(status.slice(6, -1));
    this.store.dispatch( DataActions.showStatusBoxAction( {payload: {status: status_parse }}));
    return '';
  }

  private selectableGeneric(s): string {
    s = JSON.parse(s.slice(8, -1));
    console.log('selectable generic', s);
    return '';
  }

  private refreshCommand(t) {
    const rcommand_parse = JSON.parse(t.slice(9, -1));
    this.store.dispatch( DataActions.refreshCommandAction());
    console.log('refresh command', rcommand_parse);
    return '';
  }

  private pauseScrollRequested(): string {
    return '';
  }

  private filterableMessage(...args: any): string {
    console.log('addFilterTag', args[0], args[1], args[2])
    return '';
  }

  private embeddedImage(image: any): string {
    const image_parse = image.slice(5, -1);
    console.log('renderEmbeddedImage', image_parse);
    return '';
  }

  private textLink(link: any): string {
      const link_parse = link.slice(8, -1).split(',');
      console.log('render link', link_parse);
      return '';
  }

  private renderMob(mob: any): string {
    const mob_parse = mob.slice(mob.indexOf('"') + 1, -1).split(',');
    const desc_parse = mob.slice(5).toString();
    console.log('render mob..?', mob_parse, desc_parse);
    // return _.renderMob(mob_parse[0], mob_parse[1], mob_parse[2], mob_parse[3], desc_parse, 'interact pers');
    return '';
  }

  private renderObject(obj: any): string {
    const obj_parse = obj.slice(obj.indexOf('"') + 1, -1).split(',');
    const desc_parse = obj.slice(5).toString();
    console.log('render object...?', obj_parse, desc_parse);
    // return _.renderObject(obj_parse[0], obj_parse[1], obj_parse[2], obj_parse[3], desc_parse, 'interact obj');
    return '';
  }

  private isGod(): string {
    this.dispatcher.isgod = true;
    return '';
  }

  private invisibilityLevel(inv: any): string {
    this.dispatcher.visibilLevel = parseInt(inv.substr(2, 3), 10);
    return '';
  }
}