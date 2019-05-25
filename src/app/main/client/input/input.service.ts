import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InputService {

  private _isFocussed: BehaviorSubject<boolean>;

  constructor() {
    this._isFocussed = new BehaviorSubject(false);
  }

  get isFocussed(): Observable<any> {
    return this._isFocussed;
  }

  focus() {
    this._isFocussed.next(true);
  }
}
