import { Injectable } from '@angular/core';
import { DialogConfiguration } from './model/dialog.interface';

@Injectable({
  providedIn: 'root'
})

export class GenericDialogService {

  private modals: any[] = [];

  add(modal: any) {
      // add modal to array of active modals
      this.modals.push(modal);
  }

  remove(id: string) {
      // remove modal from array of active modals
      this.modals = this.modals.filter(x => x.id !== id);
  }

  open(id: string, config?: DialogConfiguration, data?: any ): any {
      // open modal specified by id
      const modal: any = this.modals.filter(x => x.id === id)[0];
      modal.open(config);
      console.log(this.modals);
  }

  close(id: string) {
      // close modal specified by id
      const modal: any = this.modals.filter(x => x.id === id)[0];
      modal.close();
  }

  isClosed(id:string): boolean {
    const modal: any = this.modals.filter(x => x.id === id)[0];
    return modal.isClosed();
  }
}
