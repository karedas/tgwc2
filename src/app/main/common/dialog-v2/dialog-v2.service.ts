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
import { InputService } from '../../client/input/input.service';
import { WorkslistComponent } from '../../client/windows/workslist/workslist.component';
import { GameService } from '../../client/services/game.service';
import { LogComponent } from '../../client/windows/log/log.component';
import { ShortcutsPanelComponent } from '../../windows/shortcuts-panel/shortcuts-panel.component';

@Injectable({
  providedIn: 'root'
})
export class DialogV2Service {

  private render: Renderer2;
  private baseZIndex = 1000;

  constructor(
    rendererFactory: RendererFactory2,
    public dialog: MatDialog,
    private inputService: InputService,
    private game: GameService,
    public overlay: Overlay) {
    this.render = rendererFactory.createRenderer(null, null);

    dialog.afterOpened.subscribe((d: MatDialogRef<any>) => {
      this.addDialogBehaviour(d);
    });

  }

  getOverlayElement(dialogRef: MatDialogRef<any>): HTMLElement {
    return <HTMLElement>dialogRef['_overlayRef'].overlayElement;
  }


  private addDialogBehaviour(dialogRef: MatDialogRef<any>) {

    this.addBringToFrontEvent(dialogRef);

    if (!dialogRef.disableClose) {

      dialogRef.disableClose = true;

      dialogRef.keydownEvents().subscribe((e) => {
        // ordering the close event if dialog has been brought to front
        if (e.key === 'Escape') {
          this.closeForwardedDialog();
        }
      });
    }
  }

  private addBringToFrontEvent(dialogRef: MatDialogRef<any>) {

    const overlayElement = this.getOverlayElement(dialogRef);
    this.increaseZIndex(dialogRef, overlayElement);

    overlayElement.addEventListener('mousedown', () => {
      this.increaseZIndex(dialogRef, overlayElement);
    });
  }

  private increaseZIndex(dialogRef: MatDialogRef<any>, overlayElement?: HTMLElement) {

    if (!overlayElement) {
      overlayElement = this.getOverlayElement(dialogRef);
    }

    if (this.dialog.openDialogs.length > 1) {
      // Add Z-index Inline based on global Dialog zindex status
      this.render.setStyle(
        overlayElement.parentElement,
        'z-index',
        ++this.baseZIndex
      );

      // Extract DialogRef based on his ID.
      const activeDialog = this.dialog.openDialogs.find(obj => {
        return obj.id === dialogRef.id;
      });

      if (activeDialog) {
        // move the DialogRef Item to last Position dialogs array.
        this.dialog.openDialogs.push(this.dialog.openDialogs.splice(this.dialog.openDialogs.indexOf(activeDialog), 1)[0]);
      }
    }
  }

  /**
   Just close the dialog based on z-index priority
   *  */
  private closeForwardedDialog() {
    // Extract the last item in array
    const d = this.dialog.openDialogs[this.dialog.openDialogs.length - 1];
    d.close();

    // Reset Z-Index if there is 1 or less  dialog
    if (this.dialog.openDialogs.length <= 1) {
      this.baseZIndex = 1000;
    }
  }

  /**
   * DIALOGS LIST
   */

  openSmartLogin(): MatDialogRef<LoginSmartComponent, MatDialogConfig> {

    this.dialog.closeAll();

    const dialogID = 'smartlogin';

    if (!this.dialog.getDialogById(dialogID)) {
      const config = new MatDialogConfig();

      config.id = dialogID;
      config.disableClose = true;
      config.backdropClass = 'overlay-dark';

      const dialogRef = this.dialog.open(LoginSmartComponent, config);

      return dialogRef;
    }
  }

  openCookieLaw(): MatDialogRef<CookieLawComponent, MatDialogConfig> {

    const dialogID = 'cookielaw';
    const config = new MatDialogConfig();

    config.id = dialogID;
    config.disableClose = true;
    config.autoFocus = false;
    config.width = '450px';
    config.scrollStrategy = this.overlay.scrollStrategies.reposition();

    const dialogRef = this.dialog.open(CookieLawComponent, config);

    return dialogRef;

  }

  openNews(fromGame: boolean): MatDialogRef<NewsComponent, MatDialogConfig> {

    const dialogID = 'news';
    const config = new MatDialogConfig();

    config.id = dialogID;
    config.disableClose = true;
    config.width = '750px';
    config.height = '600px';
    config.minHeight = '400px';
    config.backdropClass = fromGame ? '' : 'overlay-dark';
    config.scrollStrategy = this.overlay.scrollStrategies.noop();
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
    config.disableClose = false;
    config.hasBackdrop = true;

    const dialogRef = this.dialog.open(EditorComponent, config);
    return dialogRef;
  }

  openCharacterSheet(detail?: string): MatDialogRef<CharacterSheetComponent, MatDialogConfig> {

    const dialogID = 'charactersheet';

    if (!this.dialog.getDialogById(dialogID)) {

      const config = new MatDialogConfig();

      config.id = dialogID;
      config.width = '750px';
      config.height = '650px';
      config.hasBackdrop = false;
      config.autoFocus = false;
      config.disableClose = false;
      config.scrollStrategy = this.overlay.scrollStrategies.noop();
      config.data = {
        tab: detail
      };

      const dialogRef = this.dialog.open(CharacterSheetComponent, config);

      dialogRef.afterOpened().subscribe(() => {
        // Keep focus on inputbar
        this.inputService.focus();
      });


      return dialogRef;

    } else {

      this.dialog.getDialogById(dialogID).componentInstance.data = { tab: detail };
      // Keep focus on inputbar
      this.inputService.focus();

    }
  }

  openCommandsList(): MatDialogRef<CommandsListComponent, MatDialogConfig> {

    const dialogID = 'commandslist';

    if (!this.dialog.getDialogById(dialogID)) {
      const config = new MatDialogConfig();

      config.id = dialogID;
      config.width = '750px';
      config.height = '600px';
      config.restoreFocus = true;
      config.hasBackdrop = false;
      config.restoreFocus = true;
      config.autoFocus = false;
      config.scrollStrategy = this.overlay.scrollStrategies.noop();

      const dialogRef = this.dialog.open(CommandsListComponent, config);

      dialogRef.afterOpened().subscribe(() => {
        // Keep focus on inputbar
        this.inputService.focus();
      });

      return dialogRef;
    }
  }

  openControlPanel(tab: number = 0): MatDialogRef<ControlPanelComponent, MatDialogConfig> {

    const dialogID = 'controlpanel';

    if (!this.dialog.getDialogById(dialogID)) {

      const config = new MatDialogConfig();

      config.id = dialogID;
      config.width = '550px';
      config.maxWidth = '95vw';
      config.restoreFocus = true;
      config.autoFocus = false;
      config.hasBackdrop = false;
      config.scrollStrategy = this.overlay.scrollStrategies.noop();

      config.data = {
        tab: tab
      };

      const dialogRef = this.dialog.open(ControlPanelComponent, config);
      return dialogRef;
    } else {
      this.dialog.getDialogById(dialogID).componentInstance.data = { tab: tab };
    }
  }

  /**
   *
   * @param data  [0] IBook - [1] Index page from Param
   */
  openBook(...data: any): MatDialogRef<BookComponent, MatDialogConfig> {

    const dialogID = 'book';

    const bookData = {
      title: data[0].title,
      desc: data[0].desc,
      pages: data[0].pages,
      index: data[1]
    };

    if (!this.dialog.getDialogById(dialogID)) {

      const config = new MatDialogConfig();

      config.id = dialogID;
      config.width = '550px';
      config.hasBackdrop = false;
      config.restoreFocus = true;
      config.autoFocus = false;
      config.panelClass = 'provaprova';
      config.scrollStrategy = this.overlay.scrollStrategies.noop();
      config.data = bookData;

      const dialogRef = this.dialog.open(BookComponent, config);

      dialogRef.afterOpened().subscribe(() => {
        // Keep focus on inputbar
        this.inputService.focus();
      });

      return dialogRef;
    } else {
      this.dialog.getDialogById(dialogID).componentInstance.data =  bookData;
    }
  }

  openGenericTable(...data: any): MatDialogRef<GenericTableComponent, MatDialogConfig> {

    const dialogID = 'generictable';

    if (!this.dialog.getDialogById(dialogID)) {

      const config = new MatDialogConfig();

      config.id = dialogID;
      config.width = '700px';
      config.height = 'auto';
      config.scrollStrategy = this.overlay.scrollStrategies.noop();
      config.hasBackdrop = false;
      config.restoreFocus = true;
      config.autoFocus = false;
      config.data = {
        title: data[0]
      };

      const dialogRef = this.dialog.open(GenericTableComponent, config);

      dialogRef.afterOpened().subscribe(() => {
        // Keep focus on inputbar
        this.inputService.focus();
      });

      return dialogRef;
    } else {
      this.increaseZIndex(this.dialog.getDialogById(dialogID));
    }
  }

  openWorksList(...data: any): MatDialogRef<WorkslistComponent, MatDialogConfig> {

    const dialogID = 'workslist';

    if (!this.dialog.getDialogById(dialogID)) {

      const config = new MatDialogConfig();

      config.id = dialogID;
      config.width = '700px';
      config.height = 'auto';
      config.scrollStrategy = this.overlay.scrollStrategies.noop();
      config.hasBackdrop = false;
      config.restoreFocus = true;
      config.autoFocus = false;
      config.data = {
        title: data[0]
      };

      const dialogRef = this.dialog.open(WorkslistComponent, config);
      // Keep focus on inputbar
      this.inputService.focus();

      return dialogRef;
    } else {
      this.increaseZIndex(this.dialog.getDialogById(dialogID));
    }
  }

  openLog(...data: any): MatDialogRef<LogComponent, MatDialogConfig> {

    const dialogID = 'log';
    if (!this.dialog.getDialogById(dialogID)) {

      const config = new MatDialogConfig();
      config.id = dialogID;
      config.width = '60%';
      config.height = '700px';
      config.hasBackdrop = false;
      config.scrollStrategy = this.overlay.scrollStrategies.noop();

      const dialogRef = this.dialog.open(LogComponent, config);

      return dialogRef;
    } else {
      this.increaseZIndex(this.dialog.getDialogById(dialogID));
    }

  }

  openShortcut(): MatDialogRef<ShortcutsPanelComponent, MatDialogConfig> {

    const dialogID = 'shortcut';

    if (!this.dialog.getDialogById(dialogID)) {
      const config = new MatDialogConfig();

      config.id = dialogID;
      config.width = '288px';
      config.height = 'auto';
      config.autoFocus = false;
      config.hasBackdrop = false;
      config.scrollStrategy = this.overlay.scrollStrategies.noop();

      const dialogRef = this.dialog.open(ShortcutsPanelComponent, config);

      // open shortcuts manager on link click.
      dialogRef.componentInstance.onManagerCall.subscribe(
        () => this.openControlPanel(2)
      );

      return dialogRef;
    } else {
      this.increaseZIndex(this.dialog.getDialogById(dialogID));
    }
  }
}
