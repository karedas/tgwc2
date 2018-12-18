import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../store';
import { Player } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ParserService {

  parseSubject = new BehaviorSubject<string>('');
  constructor( private store: Store<Player>) { }

  // getMessages(data):Observable<string> {
  // }

  parse(data): Observable<string> {
    try {
      this.parseForDisplay(this.preParseText(data));

    } catch (err) {
      console.log(err);
    }

    return this.parseSubject.asObservable();
  }

  preParseText(data: string): string {
    /* Remove -not-tags- */
    data = data.replace(/\r/gm, '');
    data = data.replace(/&!!/gm, '');
    data = data.replace(/\$\$/gm, '$');
    data = data.replace(/%%/gm, '%');
    data = data.replace(/&&/gm, '&#38;');
    data = data.replace(/</gm, '&#60;');
    data = data.replace(/>/gm, '&#62;');
    return data;
  }

  parseForDisplay(data: string) {

    let pos;

    //Hide text (password)
    data = data.replace(/&x\n*/gm, () => {
      // _.inputPassword();
      return '';
    });

    //Show text (normal input)
    data = data.replace(/&e\n*/gm, () => {
      // _.inputText();
      return '';
    });


    data.replace(/<p><\/p>/g, '');


    this.parseSubject.next(data);
  }
}
