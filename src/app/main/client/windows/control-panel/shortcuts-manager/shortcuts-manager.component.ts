import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
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

  @ViewChild('f') myNgForm;

  totalIcons: any;

  shortcuts: any = [];
  iconsListOpenedStatus: boolean = false;
  newShortcutOpenedStatus: boolean = false;
  scIcon: number = 1;
  newShortcutForm: FormGroup;
  shortcutExistError: boolean = false;

  private editableID: number;
  private isEdit: boolean = false;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _configService: ConfigService
  ) {
    this.totalIcons = Array(22).fill(0).map((x,i)=>i);

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

  private resetForm() {
    this.scIcon = 1;
    this.myNgForm.resetForm();

    this.isEdit = false;

  }

  openIconsList() {
    this.iconsListOpenedStatus = !this.iconsListOpenedStatus;
  }

  setNewIcon(icon: number) {
    this.scIcon = icon;
    this.iconsListOpenedStatus = false;
  }

  openNewShortcut() {
    if(!this.isEdit) {
    }

    this.newShortcutOpenedStatus = true;
  }

  closeNewShortcut() {
    console.log('close?');
    this.newShortcutOpenedStatus = false;
  }

  saveShortcut() {

    //reset error    
    this.shortcutExistError = false;
    
    const alias = this.newShortcutForm.get('scAlias').value;
    const cmd = this.newShortcutForm.get('scCmd').value;
    console.log('save');
    //check if Alias Shortcuts exists in the Array
    if(alias && cmd) {

      if(!this.shortcuts.length) {
        this.addShortcut(alias, cmd);
      } 
      else if (this.isEdit) {
        this.saveEditableShortcut(alias, cmd);
      }
      else if (this.shortcuts.filter(x => { return x.alias === alias }).length <= 0) {
        this.addShortcut(alias, cmd);
      }
      else {
        this.shortcutExistError = true;
      }
    }

    this.resetForm();

  }

  private addShortcut(alias: string, cmd: string) {
    console.log('add');
    this.shortcuts.push({ 'icon': this.scIcon, 'alias': alias, 'cmd': cmd });

    this._configService.setConfig(<TGConfig>{ shortcuts: this.shortcuts })
    this.closeNewShortcut();
  }

  private saveEditableShortcut(alias, cmd) {
    console.log('saveedit');
    this.shortcuts[this.editableID] = {
      icon: this.scIcon,
      alias: alias,
      cmd: cmd
    }

    this._configService.setConfig(<TGConfig>{ shortcuts: this.shortcuts })
    this.closeNewShortcut();
    this.isEdit = false;

  }


  deleteShortcut(alias:string) {
    const scUp =  this.shortcuts.filter(x => { return x.alias !== alias });
    this._configService.setConfig({shortcuts: scUp})
  }

  onEditShortcut(idx:number, icon: number, alias: string, cmd: string) {
    
    this.isEdit = true;

    this.editableID = idx;

    this.scIcon = icon;
    this.newShortcutForm.setValue({
      scAlias: alias,
      scCmd: cmd
    });
    
    this.openNewShortcut();
  }

}
