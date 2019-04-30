import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { TGConfig } from '../../../client-config';

@Component({
  selector: 'tg-shortcuts-manager',
  templateUrl: './shortcuts-manager.component.html',
  styleUrls: ['./shortcuts-manager.component.scss'],
})
export class ShortcutsManagerComponent implements OnInit {

  iconsListOpenedStatus: boolean = false;
  newShortcutOpenedStatus: boolean = false;

  shortcuts: any[];

  public scIcon: number;
  public scAlias: string;
  public scCmd: string;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _configService: ConfigService
  ) {
    this._unsubscribeAll = new Subject<any>();
  }

  ngOnInit() {
    this._configService.getConfig()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config: TGConfig) => { this.shortcuts = config.shortcuts });
  }

  openIconsList() {
    this.iconsListOpenedStatus = !this.iconsListOpenedStatus;
  }

  openNewShortcut() {
    this.newShortcutOpenedStatus = true;
  }

  closeNewShortcut() {
    this.newShortcutOpenedStatus = false;
  }

  saveShortcut() {

    //check if Alias Shortcuts exists in the Array
    if(this.scAlias && this.scCmd) {
      
      if (this.shortcuts.filter(x => { return x.alias === this.scAlias }).length <= 0) {
        this.shortcuts.push({ 'icon': 416, 'alias': this.scAlias, 'cmd': this.scCmd });
        this._configService.setConfig(<TGConfig>{ shortcuts: this.shortcuts })
        this.closeNewShortcut();
      }
      else {
        // Show Warning in the form and return false
        console.log('exists!!!');
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
