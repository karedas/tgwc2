import { Injectable } from '@angular/core';
import AssetsList from 'src/assets/assets_list.json';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreloaderService {

  private images: HTMLImageElement[] = [];
  private loadedImages = 0;
  private totalAssets: number;
  public status$: BehaviorSubject<boolean>;

  public percentage$: BehaviorSubject<any> =  new BehaviorSubject<any>(0);

  constructor() {

    this.status$ = new BehaviorSubject<boolean>(false);

    this.totalAssets = AssetsList.length;

    AssetsList.forEach((urlimg: string, i: any) => {
        this.images[i] = new Image();
        this.images[i].src = 'assets/images/' + urlimg;
        this.images[i].onload = () => {
        this.percentage$.next(this.percentage$.value);
        this.imageLoadPost();
        };

        this.images[i].onerror = () => {

          this.percentage$.next(this.percentage$.value);
          this.imageLoadPost();
        };
    });
  }

  private imageLoadPost() {

    this.loadedImages++;

    if (this.loadedImages === this.totalAssets) {
      this.onComplete();
    }

    this.percentage$.next(this.percentage$.value >= 100 ? 100 : this.percentage$.value  + 1 );
  }

  get percentage() {
    return this.percentage$.asObservable();
  }

  onComplete () {
    this.status$.next(true);
    this.status$.complete();
  }

}
