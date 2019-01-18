import { Component, Input, ViewEncapsulation, OnInit, AfterViewInit } from '@angular/core';
import { Room } from 'src/app/models/data/room.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'tg-room',
  templateUrl: './room.component.html',
  encapsulation: ViewEncapsulation.None
})
export class RoomComponent implements OnInit, AfterViewInit {
  @Input() html: Room;
  @Input() withExtra: boolean;
  @Input() lastDescription: any = '';

  // private perscont: string;
  // private objslist: string;

  inRoomContent: boolean;

  constructor() { 
  }

  ngOnInit(): void {
    if(this.html) {
      if (this.html.perscont || this.html.objcont) {
        this.inRoomContent = true;
      }
      else {
        this.inRoomContent = false;
      }
    }
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    
  }

  getRoomImage(img: string ): string {
      const fullPathImage = environment.media_address + img;
      return fullPathImage;
  }

  // renderDetailsList(objs: any, objsType: string): string {
  //   const html = '';
  //   const res = '';


  //   if (objs.list) {
  //     if (objsType == 'pers' || objsType == 'equip') { 

  //     }
  
  //     for (let n = 0; n < objs.list.length; n++) {
  
  //       const l = objs.list[n];
  //       // let is_group = (l.mrn && l.mrn.length) > 1;
  //       // let opened = (l.mrn && _.exp_grp_list[l.mrn[l.mrn.length - 1]]);
  //       const grp_attribute = '';
  //       const exp_attribute = '';
  //       const tooltip = '';
  //       const expicon = '';

  //     }
  //   }


  //   return html;
  // }
}
