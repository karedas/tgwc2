import { Injectable } from '@angular/core';
import AssetsList from 'src/assets/assets_list.json';
import AssetsListRegistration from 'src/assets/assets_list_registration.json';
import { BehaviorSubject } from 'rxjs';
import { Router, Event, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SplashScreenService {

  private images: HTMLImageElement[] = [];
  private loadedImages = 0;
  private totalAssets: number;
  private currentUrl: string;

  assetsDone = [];

  public status$: BehaviorSubject<boolean>;

  public percentage$: BehaviorSubject<any> = new BehaviorSubject<any>(0);

  constructor(private router: Router) {

    this.status$ = new BehaviorSubject<boolean>(false);

    this.router.events.subscribe((event: Event) => {

      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;

        if ((event.url.startsWith('/auth/registrazione')) && !this.assetsDone.includes('registration')) {
          this.currentUrl = 'registration';
          this.startPreload();
        }

        if ((event.url === '/' || event.url.startsWith('/auth/login')) && !this.assetsDone.includes('default')) {

          this.currentUrl = 'default';
          this.startPreload();
        }
      }
    });

  }

  private startPreload() {
    let assetsList: any;

    this.status$.next(false);
    this.percentage$.next(0);

    if (this.currentUrl === 'default') {
      assetsList = AssetsList;
    }
    if (this.currentUrl === 'registration') {
      assetsList = AssetsListRegistration;
    }

    this.totalAssets = assetsList.length;

    assetsList.forEach((urlimg: string, i: any) => {
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

    const calcPerc =  this.percentage$.value >= 100 ? 100 : (this.percentage$.value + (100 / this.totalAssets));
    this.percentage$.next(calcPerc);
  }

  get percentage() {
    return this.percentage$.asObservable();
  }

  onComplete() {
    this.assetsDone.push(this.currentUrl);
    this.loadedImages = 0;
    this.status$.next(true);
  }

}
