import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { CookieLawComponent } from '../../client/windows/cookie-law/cookie-law.component';
import { NewsComponent } from '../../client/windows/news/news.component';
import { EditorComponent } from '../../client/windows/editor/editor.component';
import { ControlPanelComponent } from '../../client/windows/control-panel/control-panel.component';
import { LoginSmartComponent } from '../../client/windows/login-smart/login-smart.component';
import { CharacterSheetComponent } from '../../client/windows/character-sheet/character-sheet.component';
import { CommandsListComponent } from '../../client/windows/commands-list/commands-list.component';
import { BookComponent } from '../../client/windows/book/book.component';
import { GenericTableComponent } from '../../client/windows/generic-table/generic-table.component';
import { Overlay } from '@angular/cdk/overlay';

@Injectable({
  providedIn: 'root'
})
export class DialogV2Service {


  private overlayRef;

  constructor(
    public dialog: MatDialog,
    public overlay: Overlay) {
  }

  openSmartLogin(): MatDialogRef<LoginSmartComponent, MatDialogConfig> {
    // Close All dialogs before proceed
    this.dialog.closeAll();

    const dialogID = 'smartlogin';
    const config = new MatDialogConfig();

    config.id = dialogID;
    config.disableClose = true;
    config.backdropClass = 'overlay-dark';

    const ref = this.dialog.open(LoginSmartComponent, config);

    return ref;
  }

  openCookieLaw(): MatDialogRef<CookieLawComponent, MatDialogConfig> {

    const dialogID = 'cookielaw';
    const config = new MatDialogConfig();

    config.id = dialogID;
    config.disableClose = true;
    config.width = '450px';

    const dialogRef = this.dialog.open(CookieLawComponent, config );

    return dialogRef;
  }

  openNews(): MatDialogRef<NewsComponent, MatDialogConfig> {

    const dialogID = 'news';
    const config = new MatDialogConfig();

    config.id = dialogID;
    config.disableClose = true;
    config.width = '750px';
    config.height = '600px';
    config.minHeight = '400px';
    config.restoreFocus = true;
    config.autoFocus = false;
    config.backdropClass = 'overlay-dark';

    const ref = this.dialog.open(NewsComponent, config);

    return ref;
  }

  openEditor(data?: any): MatDialogRef<EditorComponent, MatDialogConfig> {

    const dialogID = 'editor';
    const config = new MatDialogConfig();

    config.id = dialogID;
    config.width = '500px';
    config.height = '450px';
    config.restoreFocus = true;
    config.disableClose = true;

    const ref = this.dialog.open(EditorComponent, config);
    return ref;
  }

  openCharacterSheet(detail?: string): MatDialogRef<CharacterSheetComponent, MatDialogConfig> {

    const dialogID = 'charactersheet';

    if (!this.dialog.getDialogById(dialogID)) {
      const config = new MatDialogConfig();

      config.id = dialogID;
      config.width = '750px';
      config.height = '650px';
      config.hasBackdrop = false;
      config.restoreFocus = true;
      config.autoFocus = true;
      config.data = {
        tab: detail
      };

      const ref = this.dialog.open( CharacterSheetComponent, config);
      return ref;

    } else {
      this.dialog.getDialogById(dialogID).componentInstance.data = { tab: detail };
    }

  }

  openCommandsList(): MatDialogRef<CommandsListComponent, MatDialogConfig> {

    const dialogID = 'commandslist';

    if (!this.dialog.getDialogById(dialogID)) {
      const config = new MatDialogConfig();

      config.id = dialogID;
      config.width = '750px';
      config.height = '650px';
      config.restoreFocus = true;
      config.hasBackdrop = true;
      config.autoFocus = false;

      const ref = this.dialog.open( CommandsListComponent, config );
      return ref;
    }

  }

  openControlPanel(): MatDialogRef<ControlPanelComponent, MatDialogConfig> {

    const dialogID = 'controlpanel';

    if (!this.dialog.getDialogById(dialogID)) {

      const config = new MatDialogConfig();

      config.id = dialogID;
      config.width = 'auto';
      config.height = 'auto';
      config.restoreFocus = true;
      config.hasBackdrop = true;
      config.autoFocus = false;

      const ref = this.dialog.open(ControlPanelComponent, config);
      return ref;
    }
  }

  /**
   *
   * @param data  [0] IBook - [1] Index page from Param
   */
  openBook(...data: any): MatDialogRef<BookComponent, MatDialogConfig> {

    const dialogID = 'book';
    const config = new MatDialogConfig();
    config.id = dialogID;
    config.width = '550px';
    config.height = '600px';
    config.restoreFocus = true;
    config.hasBackdrop = false;
    config.panelClass = 'provaprova';
    config.scrollStrategy = this.overlay.scrollStrategies.noop()

    config.data = {
      title: data[0].title,
      desc: data[0].desc,
      pages: data[0].pages,
      index: data[1]
      // index: 0,
    };

    const ref = this.dialog.open( BookComponent, config);
    return ref;

  }


  openGenericTable(...data: any): MatDialogRef<GenericTableComponent, MatDialogConfig>  {

    const dialogID = 'generictable';
    const config = new MatDialogConfig();

    config.id = dialogID;
    config.width = 'auto';
    config.height = 'auto';
    config.hasBackdrop = false;
    config.restoreFocus = true;
    config.data = {
      title: data[0]
    };

    const ref = this.dialog.open( GenericTableComponent, config );
    return ref;
  }

}
