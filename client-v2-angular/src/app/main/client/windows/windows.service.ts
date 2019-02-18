import { Injectable } from '@angular/core';
import { DialogService as DynamicDialogService, DynamicDialogConfig } from 'primeng/api';
import { WelcomeNewsComponent } from './welcome-news/welcome-news.component';
import { Observable } from 'rxjs';
import { CookieLawComponent } from './cookie-law/cookie-law.component';
import { GenericDialogService } from '../../common/dialog/dialog.service';
import { DialogConfiguration } from '../../common/dialog/model/dialog.interface';
import { LoginSmartComponent } from './login-smart/login-smart.component';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class WindowsService {

  // dynamic Dialogs list
  private dd: any;
  // Generic Dialogs list
  private gd: any;


  constructor(

    private dynamicDialogService: DynamicDialogService,
    private genericDialogService: GenericDialogService
  ) {
    this.dd = new Map();
    this.gd = new Map();
  }

  openWelcomeNews() {
    const ref = this.dynamicDialogService.open(WelcomeNewsComponent,
      <DynamicDialogConfig>{
        header: 'Notizie',
        styleClass: 'op-100',
        closable: false,
        width: '750px',
        height: '500px',
        style: { 'max-width': '100%', 'max-height': '100%' },
        contentStyle: { 'max-height': '100%', 'max-width': '100%', 'overflow': 'auto' }
      });

      this.dd.set(ref, 'welcomenews');

  }

  openCookieLaw(): Observable<any> {
    const ref = this.dynamicDialogService.open(CookieLawComponent,
      <DynamicDialogConfig>{
        showHeader: false,
        closeOnEscape: false,
        contentStyle: { 'max-width': '450px', 'overflow': 'auto' }
      });

    return ref.onClose;
  }

  openSmartLogin() {

    this.closeAllDialogs();

    const ref = this.dynamicDialogService.open(LoginSmartComponent,
      <DynamicDialogConfig>{
        blockScroll: true,
        showHeader: false,
        modal: true,
        width: 'auto',
        height: 'auto',
      });
  }

  openCharacterSheet(detail?: string) {
    // TODO: move method in another place for a global use
    const ref = this.genericDialogService.open('charactersheet',
      <DialogConfiguration>{
        // showHeader: true,
        draggable: true,
        resizable: true,
        modal: false,
        header: 'Scheda Personaggio',
        data: detail,
        style: {
          'width': '750px',
          'height': '650px',
          'max-width': '100%',
          'max-height': '100%',
          'min-height': '550px'},
      });

      this.gd.set(ref);

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
        resizable: true
      });

      this.gd.set(ref);
  }

  openEditor(dialogID: string, ...data: any): any {
    const ref = this.genericDialogService.open(dialogID,
      <DialogConfiguration>{
        modal: true,
        resizable: true,
        draggable: true,
        maximizable: true,
        header: data[0],
        style: {
          'width': '500px',
          'height': '450px',
        }
      });

      this.gd.set(ref);

    return ref;
  }

  openDialogTable(dialogID: string, ...data: any) {
    const ref = this.genericDialogService.open(dialogID,
      <DialogConfiguration>{
        draggable: true,
        modal: false,
        header: data[0],
        style: {
          'width': 'auto',
          'height': 'auto',
        }
      });

      this.gd.set(ref);

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


