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


  private dd: any;


  constructor(

    private dynamicDialogService: DynamicDialogService,
    private genericDialogService: GenericDialogService
  ) {
    this.dd = new Map();
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

      setTimeout(() => {
        console.log('taccc');
        this.closeAllDialogs();
      }, 1200);
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
  }


  openCommandsList() {
    this.genericDialogService.open('commandsList',
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
  }

  closeGenericDialog(dialogID: string) {
    this.genericDialogService.close(dialogID);
  }

  closeAllDialogs() {
    this.dd.forEach((name, diag) => {
    });

  }
}


