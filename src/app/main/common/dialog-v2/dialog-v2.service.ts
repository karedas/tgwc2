import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { CookieLawComponent } from '../../client/windows/cookie-law/cookie-law.component';
import { NewsComponent } from '../../client/windows/news/news.component';
import { EditorComponent } from '../../client/windows/editor/editor.component';
import { ControlPanelComponent } from '../../client/windows/control-panel/control-panel.component';
import { LoginSmartComponent } from '../../client/windows/login-smart/login-smart.component';
import { CharacterSheetComponent } from '../../client/windows/character-sheet/character-sheet.component';

@Injectable({
  providedIn: 'root'
})
export class DialogV2Service {

  constructor(
    public dialog: MatDialog) { }


  openSmartLogin() {
    // this.closeAllDialogs();
    const config = new MatDialogConfig();

    config.disableClose = true;
    config.backdropClass = 'overlay-dark';
    const ref = this.dialog.open(LoginSmartComponent, config);
  }


  openCookieLaw(): MatDialogRef<CookieLawComponent, MatDialogConfig> {

    let config = new MatDialogConfig();
    config = {
      disableClose: true,
      width: '450px',
    };

    const dialogRef = this.dialog.open(CookieLawComponent, config );
    return dialogRef;
  }

  openNews(): void {

    const config = new MatDialogConfig();

    config.disableClose = true;
    config.width = '750px';
    config.height = '600px';
    config.backdropClass = 'overlay-dark';

    const ref = this.dialog.open(NewsComponent, config);
  }


  openEditor(data?: any): MatDialogRef<EditorComponent, MatDialogConfig> {

    const config = new MatDialogConfig();
    config.width = '500px';
    config.height = '450px';
    config.disableClose = true;

    const ref = this.dialog.open(EditorComponent, config);
    return ref;
  }


  openControlPanel(): MatDialogRef<ControlPanelComponent, MatDialogConfig> {

    const config = new MatDialogConfig();
    config.width = '650px';
    config.height = 'auto';

    const ref = this.dialog.open(ControlPanelComponent, config);

    return ref;
  }


  openCharacterSheet(detail?: string) {
    const config = new MatDialogConfig();

    config.width = '750px';
    config.height = '650px';
    config.hasBackdrop = true;
    config.autoFocus = true;
    config.data = {
      tab: detail
    };

    const ref = this.dialog.open( CharacterSheetComponent, config);
    //   <DialogConfiguration>{
    //     // showHeader: true,
    //     draggable: true,
    //     resizable: true,
    //     dismissableMask: true,
    //     modal: false,
    //     header: 'Scheda Personaggio',
    //     focusOnShow: false,
    //     data: detail,
    //     style: {
    //       'width': '750px',
    //       'height': '650px',
    //       // 'max-width': '100%',
    //       // 'max-height': '100%',
    //     },
    //     contentStyle: { 'max-height': '100%', 'max-width': '100%', 'overflow': 'auto' }
    //   });
    // this.gd.set(ref, 'charactersheet');
  }


}
