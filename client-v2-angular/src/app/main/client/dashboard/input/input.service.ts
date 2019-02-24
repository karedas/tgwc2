import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InputService {

  private _isFocussed: ReplaySubject<any>;

  constructor() {
    this._isFocussed = new ReplaySubject();
  }

  get isFocussed(): Observable<any> {
    return this._isFocussed;
  }

  focus() {
    this._isFocussed.next();
  }
}
