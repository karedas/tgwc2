import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { EditorComponent } from '../../components/windows/editor/editor.component';
import { ControlPanelComponent } from '../../components/windows/control-panel/control-panel.component';
import { LoginSmartComponent } from '../../components/windows/login-smart/login-smart.component';
import { CharacterSheetComponent } from '../../components/windows/character-sheet/character-sheet.component';
import { CommandsListComponent } from '../../components/windows/commands-list/commands-list.component';
import { BookComponent } from '../../components/windows/book/book.component';
import { GenericTableComponent } from '../../components/windows/generic-table/generic-table.component';
import { Overlay } from '@angular/cdk/overlay';
import { WorkslistComponent } from '../../components/windows/workslist/workslist.component';
import { LogComponent } from '../../components/windows/log/log.component';
import { ShortcutsPanelComponent } from '../../components/windows/shortcuts-panel/shortcuts-panel.component';
import { SelectableGenericComponent } from '../../components/windows/selectable-generic/selectable-generic.component';
import { BaseWindowComponent } from '../../components/windows/base-window/base-window.component';
import { ITGDialog } from '../../models/dialog.model';

@Injectable({
  providedIn: 'root'
})
export class DialogV2Service {

  private render: Renderer2;
  private baseZIndex = 1000;

  constructor(
    rendererFactory: RendererFactory2,
    public dialog: MatDialog,
    public overlay: Overlay
  ) {
    this.render = rendererFactory.createRenderer(null, null);
    dialog.afterOpened.subscribe((d: MatDialogRef<any>) => {
      this.addDialogBehaviour(d);
    });
  }

  private getOverlayElement(dialogRef: MatDialogRef<any>): HTMLElement {
    return dialogRef['_overlayRef'].overlayElement as HTMLElement;
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

  openBaseWindow(data: ITGDialog, id?: string, disableClose = false): MatDialogRef<BaseWindowComponent, MatDialogConfig> {
    const dialogID = id ? id : 'base';
    let dialogRef = this.dialog.getDialogById(dialogID);
    if (!dialogRef) {
      const config = new MatDialogConfig();
      config.id = dialogID;
      config.disableClose = disableClose;
      config.height = 'auto';
      config.maxWidth = '500px';
      config.data = data;
      dialogRef = this.dialog.open(BaseWindowComponent, config);
      return dialogRef;
    }
    return dialogRef;
  }

  openSmartLogin(): MatDialogRef<LoginSmartComponent, MatDialogConfig> {
    this.dialog.closeAll();
    const dialogID = 'smartlogin';

    if (!this.dialog.getDialogById(dialogID)) {
      const config = new MatDialogConfig();

      config.id = dialogID;
      config.disableClose = true;
      config.backdropClass = 'overlay-dark-throw';

      const dialogRef = this.dialog.open(LoginSmartComponent, config);

      return dialogRef;
    }
  }

  openEditor(data?: any): MatDialogRef<EditorComponent, MatDialogConfig> {
    const dialogID = 'editor';
    const config = new MatDialogConfig();

    config.id = dialogID;
    config.width = '500px';
    config.height = '450px';
    config.restoreFocus = true;
    config.disableClose = true;
    config.hasBackdrop = true;

    const dialogRef = this.dialog.open(EditorComponent, config);
    return dialogRef;
  }

  openCharacterSheet(detail?: string): MatDialogRef<CharacterSheetComponent, MatDialogConfig> {

    const dialogID = 'charactersheet';

    if (!this.dialog.getDialogById(dialogID)) {
      const config = new MatDialogConfig();

      config.id = dialogID;
      config.width = '800px';
      config.maxWidth = '100%';
      config.height = '700px';
      config.hasBackdrop = false;
      config.autoFocus = false;
      config.disableClose = false;
      config.scrollStrategy = this.overlay.scrollStrategies.noop();
      config.data = {
        tab: detail
      };

      const dialogRef = this.dialog.open(CharacterSheetComponent, config);

      return dialogRef;

    } else {
      this.dialog.getDialogById(dialogID).componentInstance.data = { tab: detail };
    }
  }

  openCommandsList(cmds): MatDialogRef<CommandsListComponent, MatDialogConfig> {

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
      config.data = {
        cmds
      };
      config.scrollStrategy = this.overlay.scrollStrategies.noop();

      const dialogRef = this.dialog.open(CommandsListComponent, config);

      return dialogRef;
    }
  }

  openControlPanel(tab: number = 0): MatDialogRef<ControlPanelComponent, MatDialogConfig> {

    const dialogID = 'controlpanel';

    if (!this.dialog.getDialogById(dialogID)) {

      const config = new MatDialogConfig();

      config.id = dialogID;
      config.width = '700px';
      config.height = '600px';
      config.maxHeight = '100%';
      config.maxWidth = '95vw';
      config.restoreFocus = true;
      config.autoFocus = false;
      config.hasBackdrop = false;
      config.scrollStrategy = this.overlay.scrollStrategies.noop();

      config.data = {
        tab
      };

      const dialogRef = this.dialog.open(ControlPanelComponent, config);
      return dialogRef;
    } else {
      this.dialog.getDialogById(dialogID).componentInstance.data = { tab };
    }
  }

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
      config.height = '600px';
      config.maxHeight = '100%';
      config.width = '550px';
      config.hasBackdrop = false;
      config.restoreFocus = true;
      config.autoFocus = false;
      config.scrollStrategy = this.overlay.scrollStrategies.noop();
      config.data = bookData;

      const dialogRef = this.dialog.open(BookComponent, config);
      return dialogRef;
    } else {
      this.dialog.getDialogById(dialogID).componentInstance.data = bookData;
    }
  }

  openGenericTable(): MatDialogRef<GenericTableComponent, MatDialogConfig> {

    const dialogID = 'generictable';

    if (!this.dialog.getDialogById(dialogID)) {

      const config = new MatDialogConfig();

      config.id = dialogID;
      config.width = '800px';
      config.height = 'auto';
      config.scrollStrategy = this.overlay.scrollStrategies.noop();
      config.hasBackdrop = false;
      config.restoreFocus = true;
      config.autoFocus = false;

      const dialogRef = this.dialog.open(GenericTableComponent, config);

      return dialogRef;
    } else {
      this.increaseZIndex(this.dialog.getDialogById(dialogID));
    }
  }

  openWorksList(): MatDialogRef<WorkslistComponent, MatDialogConfig> {

    const dialogID = 'workslist';

    if (!this.dialog.getDialogById(dialogID)) {

      const config = new MatDialogConfig();

      config.id = dialogID;
      config.width = '800px';
      config.height = 'auto';
      config.scrollStrategy = this.overlay.scrollStrategies.noop();
      config.hasBackdrop = false;
      config.restoreFocus = true;
      config.autoFocus = false;

      const dialogRef = this.dialog.open(WorkslistComponent, config);

      return dialogRef;
    } else {
      this.increaseZIndex(this.dialog.getDialogById(dialogID));
    }
  }

  openLog(): MatDialogRef<LogComponent, MatDialogConfig> {

    const dialogID = 'log';
    if (!this.dialog.getDialogById(dialogID)) {

      const config = new MatDialogConfig();
      config.id = dialogID;
      config.width = '850px';
      config.height = '700px';
      config.maxWidth = '100%';
      config.hasBackdrop = false;
      config.panelClass = 'minimal';
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
      config.width = '352px';
      config.height = 'auto';
      config.maxHeight = '100%';
      config.autoFocus = false;
      config.hasBackdrop = false;
      config.scrollStrategy = this.overlay.scrollStrategies.noop();

      const dialogRef = this.dialog.open(ShortcutsPanelComponent, config);

      // open shortcuts manager on link click.
      dialogRef.componentInstance.managerCall.subscribe(
        () => this.openControlPanel(2)
      );

      return dialogRef;
    } else {
      this.increaseZIndex(this.dialog.getDialogById(dialogID));
    }
  }

  openSelectableGeneric(data: any): MatDialogRef<SelectableGenericComponent, MatDialogConfig> {
    const dialogID = 'selectable-generic';

    if (!this.dialog.getDialogById(dialogID)) {
      const config = new MatDialogConfig();

      config.id = dialogID;
      config.width = '500px';
      config.height = '500px';
      config.maxHeight = '100%';
      config.autoFocus = false;
      config.hasBackdrop = false;
      config.data = data;
      config.scrollStrategy = this.overlay.scrollStrategies.noop();

      const dialogRef = this.dialog.open(SelectableGenericComponent, config);

      return dialogRef;
    }
  }
}
