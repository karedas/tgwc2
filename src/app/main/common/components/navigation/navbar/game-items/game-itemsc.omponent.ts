import {
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewEncapsulation
} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {TGConfig} from 'src/app/main/client/client-config';
import {IDateTime} from 'src/app/main/client/models/data/dateTime.model';
import {DispenserService} from 'src/app/main/client/services/dispenser.service';
import {getDateTime} from 'src/app/main/client/store/selectors';
import {DataState} from 'src/app/main/client/store/state/data.state';
import {ConfigService} from 'src/app/services/config.service';
import {versions} from 'src/environments/versions';

@Component({
  selector: 'tg-game-items',
  templateUrl: './game-items.component.html',
  encapsulation: ViewEncapsulation.None
})
export class TgGameItemsComponent implements OnInit, OnDestroy {
  tgConfig: TGConfig;

  enteredButton = false;
  isMatMenuOpen = false;
  isMatMenu2Open = false;
  prevButtonTrigger;
  gitVersion = versions.tag;
  gameData$: Observable<IDateTime>;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private render: Renderer2,
    private configService: ConfigService,
    private dispenserService: DispenserService,
    private store: Store<DataState>
  ) {
    this.gameData$ = this.store.pipe(select(getDateTime));
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.configService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config: TGConfig) => {
        this.tgConfig = config;
      });
  }

  menuenter() {
    this.isMatMenuOpen = true;
    if (this.isMatMenu2Open) {
      this.isMatMenu2Open = false;
    }
  }

  menuLeave(trigger, button) {
    setTimeout(() => {
      if (!this.isMatMenu2Open && !this.enteredButton) {
        this.isMatMenuOpen = false;
        trigger.closeMenu();
        this.render.removeClass(
          button._elementRef.nativeElement,
          'cdk-focused'
        );
        this.render.removeClass(
          button._elementRef.nativeElement,
          'cdk-program-focused'
        );
      } else {
        this.isMatMenuOpen = false;
      }
    }, 80);
  }

  buttonEnter(trigger) {
    setTimeout(() => {
      if (this.prevButtonTrigger && this.prevButtonTrigger !== trigger) {
        this.prevButtonTrigger.closeMenu();
        this.prevButtonTrigger = trigger;
        this.isMatMenuOpen = false;
        this.isMatMenu2Open = false;
        trigger.openMenu();
      } else if (!this.isMatMenuOpen) {
        this.enteredButton = true;
        this.prevButtonTrigger = trigger;
        trigger.openMenu();
      } else {
        this.enteredButton = true;
        this.prevButtonTrigger = trigger;
      }
    });
  }

  buttonLeave(trigger, button) {
    setTimeout(() => {
      if (this.enteredButton && !this.isMatMenuOpen) {
        trigger.closeMenu();
        this.render.removeClass(
          button._elementRef.nativeElement,
          'cdk-focused'
        );
        this.render.removeClass(
          button._elementRef.nativeElement,
          'cdk-program-focused'
        );
      }
      if (!this.isMatMenuOpen) {
        trigger.closeMenu();
        this.render.removeClass(
          button._elementRef.nativeElement,
          'cdk-focused'
        );
        this.render.removeClass(
          button._elementRef.nativeElement,
          'cdk-program-focused'
        );
      } else {
        this.enteredButton = false;
      }
    }, 100);
  }

  onItemClick(what: string, event?: any, ...args: any) {
    this.isMatMenuOpen = true;
    if (what) {
      this.dispenserService.do(what, args);
    }
    return false;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
