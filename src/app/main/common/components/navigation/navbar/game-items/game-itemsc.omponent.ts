import { Component, OnInit, Renderer2, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TGConfig } from 'src/app/main/client/client-config';
import { DispenserService } from 'src/app/main/client/services/dispenser.service';
import { versions } from 'src/environments/versions';

@Component({
  selector: 'tg-game-items',
  templateUrl: './game-items.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class TgGameItemsComponent implements OnInit, OnDestroy {

  tgConfig: TGConfig;

  enteredButton = false;
  isMatMenuOpen = false;
  isMatMenu2Open = false;
  prevButtonTrigger;

  gitVersion = versions.tag;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private render: Renderer2,
    private _configService: ConfigService,
    private dispenserService: DispenserService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

    this._configService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe( (config: TGConfig ) => {
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
        this.render.removeClass(button._elementRef.nativeElement, 'cdk-focused');
        this.render.removeClass(button._elementRef.nativeElement, 'cdk-program-focused');
      } else {
        this.isMatMenuOpen = false;
      }
    }, 80);
  }

  menu2enter() {
    this.isMatMenu2Open = true;
  }

  menu2Leave(trigger1, trigger2, button) {
    setTimeout(() => {
      if (this.isMatMenu2Open) {
        trigger1.closeMenu();
        this.isMatMenuOpen = false;
        this.isMatMenu2Open = false;
        this.enteredButton = false;
        this.render.removeClass(button._elementRef.nativeElement, 'cdk-focused');
        this.render.removeClass(button._elementRef.nativeElement, 'cdk-program-focused');
      } else {
        this.isMatMenu2Open = false;
        trigger2.closeMenu();
      }
    }, 100);
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
        this.render.removeClass(button._elementRef.nativeElement, 'cdk-focused');
        this.render.removeClass(button._elementRef.nativeElement, 'cdk-program-focused');
      } if (!this.isMatMenuOpen) {
        trigger.closeMenu();
        this.render.removeClass(button._elementRef.nativeElement, 'cdk-focused');
        this.render.removeClass(button._elementRef.nativeElement, 'cdk-program-focused');
      } else {
        this.enteredButton = false;
      }
    }, 100);
  }

  onItemClick(what: string) {
    this.dispenserService.do(what);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
