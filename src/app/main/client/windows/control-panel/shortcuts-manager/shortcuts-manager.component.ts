import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { TGConfig } from '../../../client-config';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'tg-shortcuts-manager',
  templateUrl: './shortcuts-manager.component.html',
  styleUrls: ['./shortcuts-manager.component.scss'],
})
export class ShortcutsManagerComponent implements OnInit {

  shortcuts: any[];
  iconsListOpenedStatus: boolean = false;
  newShortcutOpenedStatus: boolean = false;
  scIcon: number = 416;
  newShortcutForm: FormGroup;
  
  shortcutExistError: boolean = false;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _configService: ConfigService
  ) {
    this._unsubscribeAll = new Subject<any>();
  }

  ngOnInit() {

    this.newShortcutForm = new FormGroup({
      scAlias: new FormControl(''),
      scCmd: new FormControl(''),
    });

    this._configService.getConfig()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config: TGConfig) => { this.shortcuts = config.shortcuts });
  }

  openIconsList() {
    this.iconsListOpenedStatus = !this.iconsListOpenedStatus;
  }

  setNewIcon(icon: number) {
    this.scIcon = icon;
    console.log(this.scIcon);
    this.iconsListOpenedStatus = false;
  }

  openNewShortcut() {
    this.newShortcutOpenedStatus = true;
  }

  closeNewShortcut() {
    this.newShortcutOpenedStatus = false;
    
  }

  saveShortcut() {

    //reset error    
    this.shortcutExistError = false;
    
    const alias = this.newShortcutForm.get('scAlias').value;
    const cmd = this.newShortcutForm.get('scCmd').value;
    
    //check if Alias Shortcuts exists in the Array
    if(alias && cmd) {
      
      if (this.shortcuts.filter(x => { return x.alias === alias }).length <= 0) {
        this.shortcuts.push({ 'icon': this.scIcon, 'alias': alias, 'cmd': cmd });
        this._configService.setConfig(<TGConfig>{ shortcuts: this.shortcuts })
        this.closeNewShortcut();
        this.newShortcutForm.reset();
      }
      else {
        this.shortcutExistError = true;
      }
    }
  }


  deleteShortcut(alias:string) {
    const scUp =  this.shortcuts.filter(x => { return x.alias !== alias });
    console.log(scUp);
    this._configService.setConfig({shortcuts: scUp})
  }

  onEditShortcut() {
    // this.saveShortcut(416, 'test001', 'sied;alza;di ok funziona');
  }

}
