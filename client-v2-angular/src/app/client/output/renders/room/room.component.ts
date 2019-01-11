import { Component, Input, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Room } from 'src/app/models/data/room.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'tg-room',
  templateUrl: './room.component.html',
  encapsulation: ViewEncapsulation.None
})
export class RoomComponent implements AfterViewInit {
  @Input() html: Room;
  @Input() withExtra: boolean;
  @Input() lastDescription: any = '';

  private perscont: string;
  private objcont: string;

  constructor() { }

  ngAfterViewInit() {
    // if (this.html.objcont) {
    //   this.renderDetailsList(this.html.objcont, 'obj')
    // }
  }

  getRoomImage(img:string ): string {
     const fullPathImage = environment.media_address + img
     return fullPathImage;
  }

  renderDetailsList(objs:any, objsType:string): string {
    let html = '';
    let res = '';
    let interactClass = '';

    if (objs.list) {
      if (objsType == 'pers' || objsType == 'equip') { }
    }

    for (let n = 0; n < objs.list.length; n++) {

      let l = objs.list[n];
      // let is_group = (l.mrn && l.mrn.length) > 1;
      // let opened = (l.mrn && _.exp_grp_list[l.mrn[l.mrn.length - 1]]);
      let grp_attribute = '';
      let exp_attribute = '';
      let tooltip = '';
      let expicon = '';


      /* if object/person type is more then 1 */
      // if (is_group) {
      //   interactClass = '';
      //   grp_attribute = ' grpcoll';

      //   // if (opened) {
      //   //   grp_attribute += ' d-none';
      //   // }
      //   expicon = '<div class="expicon"></div>';
      // } else {
      //   interactClass = ' interact'
      // }


      /* print header triggerable element */
      //html += `<div class="element${grp_attribute} ">`;
      // mob/obj icon
      // this.objcont += _.renderIcon(l.icon, l.mrn ? l.mrn[0] : null, cont_type, l.cntnum, null, interactClass + ' ' + type);
      // this.objcont += '<div class="desc">' + _.decoratedDescription(l.condprc, l.mvprc, l.wgt, l.sz ? l.sz : 1, (l.eq ? '<b class="poseq">' + _.equip_positions_by_num[l.eq[0]] + '</b>: ' : '') + l.desc) + '</div>';
      //html += '</div>';

      /* Start Collapsable Obj/Mob Container */
      // if (is_group) {

      //   // if (!opened) {
      //   //   exp_attribute = ' style="display:none"';
      //   // }

      //   html += '<div class="grpexp"' + exp_attribute + '>';

      //   for (let m = 0; m < l.mrn.length; m++) {
      //     html += '<div class="element">'
      //     // this.objcont += (m == 0 ? '<div class="collicon"></div>' : '') + _.renderIcon(l.icon, l.mrn[m], cont_type, l.cntnum, null, 'interact ' + type);
      //     // this.objcont += '<div class="desc">' + _.decoratedDescription(l.condprc, l.mvprc, l.wgt, 1, l.desc) + '</div>';
      //     html += '</div>';
      //   }

      //   if (l.sz && l.sz > l.mrn.length) {
      //     html += '<div class="element">';
      //     // this.objcont += _.renderIcon(l.icon, null, cont_type, l.cntnum, null, null);
      //     html += '<div class="desc">';
      //     // this.objcont += _.decoratedDescription(l.condprc, l.mvprc, l.wgt, l.sz - l.mrn.length, l.desc);
      //     html += '</div>';
      //     html += '</div>';
      //   }

      //   html += '</div>';
      // }
    }


    return html;
  }
}
