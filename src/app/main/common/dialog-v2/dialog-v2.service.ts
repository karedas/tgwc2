import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { CookieLawComponent } from '../../client/windows/cookie-law/cookie-law.component';
import { NewsComponent } from '../../client/windows/news/news.component';
import { EditorComponent } from '../../client/windows/editor/editor.component';
import { ControlPanelComponent } from '../../client/windows/control-panel/control-panel.component';
import { LoginSmartComponent } from '../../client/windows/login-smart/login-smart.component';

@Injectable({
  providedIn: 'root'
})
export class DialogV2Service {

  constructor(
    public dialog: MatDialog) { }


  openSmartLogin() {
    // this.closeAllDialogs();
    let config = new MatDialogConfig();
    
    config.disableClose = true;
    config.backdropClass = 'overlay-dark';
    const ref = this.dialog.open(LoginSmartComponent,config);
  }


  openCookieLaw(): MatDialogRef<CookieLawComponent, MatDialogConfig>{

    let config = new MatDialogConfig();
    config = {
      disableClose: true,
      width: '450px',
    };
    
    const dialogRef = this.dialog.open(CookieLawComponent, config );
    return dialogRef;
  }
  
  openNews(): void{

    let config = new MatDialogConfig();

    config.disableClose = true;
    config.width = '750px';
    config.height = '600px';
    config.backdropClass = 'overlay-dark';

    const ref = this.dialog.open(NewsComponent, config);
  }

  
  openEditor(...data: any ): MatDialogRef<EditorComponent, MatDialogConfig> {
    console.log(data);
    let config = new MatDialogConfig();
    config.width = '500px';
    config.height = '450px';
    config.disableClose = true;

    const ref = this.dialog.open(EditorComponent,config);
    return ref;
  }


  openControlPanel(): MatDialogRef<ControlPanelComponent, MatDialogConfig>{ 
    
    let config = new MatDialogConfig();
    config.width = '650px';
    config.height = 'auto';

    const ref = this.dialog.open(ControlPanelComponent, config);

    return ref;

  }


}
