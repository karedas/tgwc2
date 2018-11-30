import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkStatusService {

  private status = new BehaviorSubject('Connessione al server in corso...');
  currentStatus = this.status.asObservable();
   
  constructor() { }

  changeStatus(newStatus: string) {
    this.status.next(newStatus);
  }
}
