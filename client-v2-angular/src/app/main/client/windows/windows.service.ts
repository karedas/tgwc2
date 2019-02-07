import { Injectable } from '@angular/core';
import { DialogService as DynamicDialogService, DynamicDialogConfig } from 'primeng/api';
import { WelcomeNewsComponent } from './welcome-news/welcome-news.component';
import { Observable } from 'rxjs';
import { CookieLawComponent } from './cookie-law/cookie-law.component';
import { GenericDialogService } from '../../common/dialog/dialog.service';
import { DialogConfiguration } from '../../common/dialog/model/dialog.interface';


@Injectable({
  providedIn: 'root'
})
export class WindowsService {

  constructor(
    private dynamicDialogService: DynamicDialogService,
    private genericDialogService: GenericDialogService
  ) { }

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

  openSmartLogin() { }

  openCommandsList() {
    this.genericDialogService.open('commandsList',
      <DialogConfiguration>{
        header: 'Lista comandi',
        width: '750px',
        height: '500px',
        style: { 'max-width': '100%', 'max-height': '100%' },
        styleClass: 'op-100',
        blockScroll: true,
        modal: false,
        draggable: true,
        resizable: true
      });
  }

  openEditor(dialogID: string, ...data: any): Observable<any> {
    const ref = this.genericDialogService.open(dialogID, 
      <DialogConfiguration>{
        width: '500px',
        height: '450px',
        resizable: true,
        draggable: true,
        maximizable: true,
        header: data[0]
      });

      return ref;
  }

  openDialogTable(dialogID: string, ...data: any) {
    const ref = this.genericDialogService.open(dialogID, 
      <DialogConfiguration> {
        draggable: true,
        modal: false,
        width: 'auto',
        height: 'auto',
        header: data[0]
      });
  }
}


