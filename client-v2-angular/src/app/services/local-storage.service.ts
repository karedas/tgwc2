import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  
  prefix: string;
  expires: number;
  when: number;

  constructor() {
    this.prefix = 'tgwc_';
    this.expires = 365.10;
   }

   setup(): void{
   };

   read(what){

     what = this.prefix + what;

     let data = localStorage[what];
     return data ? JSON.parse(data) : null;
   }

   save(what, value){
     
   }
}
