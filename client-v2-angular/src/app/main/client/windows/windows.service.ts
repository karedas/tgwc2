import { Injectable } from '@angular/core';
import { DialogService as DynamicDialogService, DynamicDialogConfig } from 'primeng/api';
import { WelcomeNewsComponent } from './welcome-news/welcome-news.component';
import { Observable } from 'rxjs';
import { CookieLawComponent } from './cookie-law/cookie-law.component';
import { GenericDialogService } from '../../common/dialog/dialog.service';
import { DialogConfiguration } from '../../common/dialog/model/dialog.interface';
import { LoginSmartComponent } from './login-smart/login-smart.component';
import { CharacterSheetComponent } from './character-sheet/character-sheet.component';


@Injectable({
  providedIn: 'root'
})
export class WindowsService {
  
  private dialogs: any;

  constructor(

    private dynamicDialogService: DynamicDialogService,
    private genericDialogService: GenericDialogService
  ) {

    this.dialogs = new Map();
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

  openCharacterSheet() {

    //TODO: move method in another place for a global use
    
    if(!this.dialogs.has('charactersheet')) {
      const ref = this.dynamicDialogService.open(CharacterSheetComponent, 
        <DynamicDialogConfig>{
          showHeader: true,
          modal: false,
          header: 'Scheda Personaggio',
          width: '750px',
          height: '650px',
          style: { 'max-width': '100%', 'max-height': '100%' },
          contentStyle: { 'max-height': '100%', 'max-width': '100%', 'overflow': 'auto' }
        });
  
        this.dialogs.set('charactersheet', true);

        ref.onClose.subscribe(() => {
          this.dialogs.delete('charactersheet');
        })
    }
  }


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

  openEditor(dialogID: string, ...data: any): any {
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

  closeGenericDialog(dialogID:string) {
    this.genericDialogService.close(dialogID);
  }
}


