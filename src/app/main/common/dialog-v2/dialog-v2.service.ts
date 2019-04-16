import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { NewsComponent } from '../../client/windows/news/news.component';
import { EditorComponent } from '../../client/windows/editor/editor.component';
import { ControlPanelComponent } from '../../client/windows/control-panel/control-panel.component';
import { LoginSmartComponent } from '../../client/windows/login-smart/login-smart.component';
import { CharacterSheetComponent } from '../../client/windows/character-sheet/character-sheet.component';
import { CommandsListComponent } from '../../client/windows/commands-list/commands-list.component';
import { BookComponent } from '../../client/windows/book/book.component';
import { GenericTableComponent } from '../../client/windows/generic-table/generic-table.component';
import { Overlay } from '@angular/cdk/overlay';
import { CookieLawComponent } from '../../client/windows/cookie-law/cookie-law.component';

@Injectable({
  providedIn: 'root'
})
export class DialogV2Service {

  // _baseZIndex: number = 1000;
  private render: Renderer2;
  private baseZIndex: number = 1000;
  private dialogs: any[] = [];
  private idLastDialog: string;

  constructor(
    rendererFactory: RendererFactory2,
    public dialog: MatDialog,
    public overlay: Overlay) {
    this.render = rendererFactory.createRenderer(null, null);
  }

  private addBringToFrontEvent(dialogRef:MatDialogRef<any>) {

    const overlayElement = <HTMLElement>dialogRef['_overlayRef'].overlayElement;
    this.increaseZIndex(dialogRef, overlayElement);
    
    overlayElement.addEventListener('click', () => {
      this.increaseZIndex(dialogRef, overlayElement);
    })
  }

  private increaseZIndex(dialogRef: MatDialogRef<any>, overlayElement: HTMLElement) {
    this.idLastDialog = dialogRef.id;
    this.render.setStyle(
      overlayElement.parentElement,
      'z-index',
      ++this.baseZIndex
    )
  }

  private addDialogBehaviour(dialogRef: MatDialogRef<any>) {
      
    //Saving the last added DialogID
    this.idLastDialog = dialogRef.id;

    this.addBringToFrontEvent(dialogRef);

    dialogRef.keydownEvents().subscribe((key) => {
      //ordering the close event if dialog has been brought to front
      if(key.keyCode === 27) {
        if(dialogRef.id === this.idLastDialog) {
          dialogRef.close();
        } else {
          this.dialog.getDialogById(this.idLastDialog).close();
        }
      }
    });
  }

  closeLastDialog() {
    this.dialog.getDialogById('cookielaw').close();
  }

  openSmartLogin(): MatDialogRef<LoginSmartComponent, MatDialogConfig> {
    // Close All dialogs before proceed

    const dialogID = 'smartlogin';
    const config = new MatDialogConfig();

    config.id = dialogID;
    config.disableClose = true;
    config.backdropClass = 'overlay-dark';

    const dialogRef = this.dialog.open(LoginSmartComponent, config);

    this.dialogs.push(dialogRef);
    return dialogRef;
  }

  openCookieLaw(): MatDialogRef<CookieLawComponent, MatDialogConfig> {

    const dialogID = 'cookielaw';
    const config = new MatDialogConfig();

    config.id = dialogID;
    config.disableClose = true;
    config.width = '450px';
    config.scrollStrategy = this.overlay.scrollStrategies.reposition();

    const dialogRef = this.dialog.open(CookieLawComponent, config);

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

    const dialogRef = this.dialog.open(NewsComponent, config);
    return dialogRef;
  }

  openEditor(data?: any): MatDialogRef<EditorComponent, MatDialogConfig> {

    const dialogID = 'editor';
    const config = new MatDialogConfig();

    config.id = dialogID;
    config.width = '500px';
    config.height = '450px';
    config.restoreFocus = true;
    config.disableClose = true;

    const dialogRef = this.dialog.open(EditorComponent, config);

    return dialogRef;
  }

  openCharacterSheet(detail?: string): MatDialogRef<CharacterSheetComponent, MatDialogConfig> {

    const dialogID = 'charactersheet';

    if (!this.dialog.getDialogById(dialogID)) {
      const config = new MatDialogConfig();
      config.id = dialogID;
      config.width = '750px';
      config.hasBackdrop = false;
      config.restoreFocus = true;
      config.disableClose = true;
      config.scrollStrategy = this.overlay.scrollStrategies.reposition();
      config.data = {
        tab: detail
      };

      const dialogRef = this.dialog.open(CharacterSheetComponent, config);

      this.addDialogBehaviour(dialogRef);

      return dialogRef;

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
      config.restoreFocus = true;
      config.hasBackdrop = false;
      config.autoFocus = false;
      config.scrollStrategy = this.overlay.scrollStrategies.reposition();

      const dialogRef = this.dialog.open(CommandsListComponent, config);

      return dialogRef;
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

      const dialogRef = this.dialog.open(ControlPanelComponent, config);

      return dialogRef;
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
    config.restoreFocus = true;
    config.hasBackdrop = false;
    config.panelClass = 'provaprova';
    config.scrollStrategy = this.overlay.scrollStrategies.reposition();

    config.data = {
      title: data[0].title,
      desc: data[0].desc,
      pages: data[0].pages,
      index: data[1]
      // index: 0,
    };

    const dialogRef = this.dialog.open(BookComponent, config);

    return dialogRef;

  }

  openGenericTable(...data: any): MatDialogRef<GenericTableComponent, MatDialogConfig> {

    const dialogID = 'generictable';
    const config = new MatDialogConfig();

    config.id = dialogID;
    config.width = 'auto';
    config.height = 'auto';
    config.hasBackdrop = false;
    config.disableClose = true;
    config.restoreFocus = true;
    config.data = {
      title: data[0]
    };

    const dialogRef = this.dialog.open(GenericTableComponent, config);

    this.addDialogBehaviour(dialogRef);


    return dialogRef;
  }
}
