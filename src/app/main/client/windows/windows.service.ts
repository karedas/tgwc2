import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { DialogService as DynamicDialogService, DynamicDialogConfig } from 'primeng/api';
import { WelcomeNewsComponent } from './welcome-news/welcome-news.component';
import { Observable } from 'rxjs';
import { CookieLawComponent } from './cookie-law/cookie-law.component';
import { GenericDialogService } from '../../common/dialog/dialog.service';
import { DialogConfiguration } from '../../common/dialog/model/dialog.interface';
import { LoginSmartComponent } from './login-smart/login-smart.component';


@Injectable({
  providedIn: 'root'
})
export class WindowsService {

  // dynamic Dialogs list
  private dd: any;
  // Generic Dialogs list
  private gd: any;


  private render: Renderer2;

  constructor(
    private dynamicDialogService: DynamicDialogService,
    private genericDialogService: GenericDialogService,
    rendererFactory: RendererFactory2
  ) {

    this.dd = new Map();
    this.gd = new Map();
    this.render = rendererFactory.createRenderer(null, null);

  }

  openWelcomeNews() {
    const ref = this.dynamicDialogService.open(WelcomeNewsComponent,
      <DynamicDialogConfig>{
        header: 'Notizie',
        styleClass: 'op-100',
        closable: false,
        width: '750px',
        height: '600px',
        style: { 'max-width': '100%', 'max-height': '100%' },
        contentStyle: { 'max-height': '100%', 'max-width': '100%', 'overflow': 'auto' }
      });

      ref.onClose.subscribe(
       () => this.render.removeClass(document.body, 'overlay-dark')
      );

      this.dd.set(ref, 'welcomenews');

  }

  openCookieLaw(): Observable<any> {
    const ref = this.dynamicDialogService.open(CookieLawComponent,
      <DynamicDialogConfig>{
        showHeader: false,
        closeOnEscape: false,
        styleClass: 'tg-dialog',
        width: '450px',
        height: 'auto',
        style: { 'max-width': '100%', 'max-height': '100%' },
        contentStyle: { 'max-height': '100%', 'max-width': '100%', 'overflow': 'auto' }
      });

    return ref.onClose;
  }

  openSmartLogin() {

    this.closeAllDialogs();

    const ref = this.dynamicDialogService.open(LoginSmartComponent,
      <DynamicDialogConfig>{
        blockScroll: true,
        showHeader: false,
        styleClass: 'smartlogin',
        modal: true,
        width: 'auto',
        height: 'auto',
      });

      this.render.addClass(document.body, 'overlay-dark');
      ref.onClose.subscribe(
       () => this.render.removeClass(document.body, 'overlay-dark')
      );
  }

  openCharacterSheet(detail?: string) {
    // TODO: move method in another place for a global use
    const ref = this.genericDialogService.open('charactersheet',
      <DialogConfiguration>{
        // showHeader: true,
        draggable: true,
        resizable: true,
        dismissableMask: true,
        modal: false,
        header: 'Scheda Personaggio',
        focusOnShow: false,
        data: detail,
        style: {
          'width': '750px',
          'height': '650px',
          // 'max-width': '100%',
          // 'max-height': '100%',
        },
        contentStyle: { 'max-height': '100%', 'max-width': '100%', 'overflow': 'auto' }
      });
      this.gd.set(ref, 'charactersheet');
  }

  openCommandsList() {
    const ref = this.genericDialogService.open('commandsList',
      <DialogConfiguration>{
        header: 'Lista comandi',
        style: {
          'width': '750px',
          'height': '500px',
          'max-width': '100%',
          'max-height': '100%'
        },
        styleClass: 'op-100',
        blockScroll: true,
        modal: false,
        draggable: true,
        resizable: true,
        focusOnShow: false,

      });

      this.gd.set(ref, 'commandslist');
  }

  openEditor(dialogID: string, ...data: any): any {
    const ref = this.genericDialogService.open(dialogID,
      <DialogConfiguration>{
        modal: true,
        resizable: true,
        draggable: true,
        maximizable: true,
        focusOnShow: false,
        header: data[0],
        style: {
          'width': '500px',
          'height': '450px',
        }
      });

    this.gd.set(ref, 'editor');
    return ref;
  }

  openDialogTable(dialogID: string, ...data: any) {
    const ref = this.genericDialogService.open(dialogID,
      <DialogConfiguration>{
        draggable: true,
        modal: false,
        header: data[0],
        focusOnShow: false,
        style: {
          'width': 'auto',
          'height': 'auto',
        },
        contentStyle: {
          'min-width': '400px'
        }
      });

      this.gd.set(ref, 'table');
  }

  openBook(dialogID: string, ...data: any): any {
    const ref = this.genericDialogService.open(dialogID,
      <DialogConfiguration>{
        draggable: true,
        resizable: false,
        header: data[0],
        closeOnEscape: true,
        focusOnShow: false,
        maximizable: true,
        modal: false,
        style: {
          'width': '500px',
          'height': '600px',
        },
        contentStyle: {
          'height': '100%'
        }
      });

      this.gd.set(ref, 'book');

      return ref;
  }

  closeGenericDialog(dialogID: string) {
    this.genericDialogService.close(dialogID);
  }

  closeAllDialogs() {
    this.dd.forEach((name, diag) => {
      diag.close();
      this.dd.delete(name);
    });

    this.gd.forEach((name, diag) => {
      diag.visible = false;
      this.gd.delete(name);
    });
  }
}
