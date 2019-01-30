import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private resizingEvent$: Subject<any[]> = new Subject<any[]>();
  private resizedEvent$: Subject<any[]> = new Subject<any[]>();

  private modals: any[] = [];

  add (modal: any) {
    // add modal to array of active modals
    this.modals.push(modal);
  }

  open (id: string) {
    // open modal specified by id
    const modal: any = this.modals.filter(x => x.id === id)[0];
    modal.open();
  }

  close (id: string) {
    // close modal specified by id
    const modal: any = this.modals.filter(x => x.id === id)[0];
    modal.close();
  }

  remove(id: string) {
      // remove modal from array of active modals
      this.modals = this.modals.filter(x => x.id !== id);
  }

  toFront(id: string) {
    const modal: any = this.modals.filter(x => x.id === id)[0];
    modal.toFront();
  }

  // setResizing(event) {
  //   this.resizedEvent$.next(
  // }

  // setResized(event) {}

  // onResizing(id: string): Observable<any> {
  //   return this.resizingEvent$.asObservable();
  // }
  // onResized(id: string): Observable<any> {
  //   return this.resizedEvent$.asObservable();
  // }

}
