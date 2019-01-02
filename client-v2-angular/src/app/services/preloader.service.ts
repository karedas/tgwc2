import { Injectable } from '@angular/core';

import * as AssetsList from 'src//assets/assets_list.json';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError, flatMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PreloaderService {

  private assets: Object[];
  private stepSize = 0;

  private workflow: any  = [];


  constructor(private http: HttpClient) {
/*
    this.load().subscribe(
      res => {
          console.log(res);
          this.stepSize = 100 / res.length;

      })*/

  }

  load(): void {

    const percentage = 0;

        const loadImages = 0,
        images = [],
        assets = [AssetsList];
        /*function imageloadpost() {

          if (loadedimages == assets.length - 1) {
              percentage = 100;
          }
          $('#tgPreloader').find('span').text(percentage);
          $('.pbar').css('width', percentage + '%');

          loadedimages++;

          if (loadedimages == assets.length) {
              postaction(images) //call postaction and pass in newimages array as parameter
          }

          percentage = percentage > 100 ? 100 : percentage;
          $('#tgPreloader').find('span').text(percentage);
      }*/

/*          .subscribe(data => {
            this.items = data;
            console.log(data);
          });*//*
          for (let i = 0; i < assets.length; i++) {
              images[i] = new Image();
              images[i].src = _.basepath + assets[i];
              images[i].onload = () => {
                  percentage++;
                  this.imageloadpost();
              }
              images[i].onerror = () =>  {
                  percentage++;
                  this.imageloadpost();
              }
          }
/* return { //return blank object with done() method
              done: function (f) {
                  postaction = f || postaction //remember user defined callback functions to be called when images load
              }
          }
          return;
          */
  }

  imageloadpost () {}
}
