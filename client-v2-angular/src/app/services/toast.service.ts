import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private messageSource = new Subject<Notification | Notification []>(); 
  private clearSource = new Subject<string>();

  messageObserver = this.messageSource.asObservable();
  clearObserver = this.clearSource.asObservable();

  add(messages: Notification[]) {
    if(messages && messages.length) {
      this.messageSource.next(messages);
    }
  }

  addAll(messages: Notification[]) {
    if(messages && messages.length) {
        this.messageSource.next(messages);
      } 
  }

  clear(key?: string) {
      this.clearSource.next(key||null);
  }
}
