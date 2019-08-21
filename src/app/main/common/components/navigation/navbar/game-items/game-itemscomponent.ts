import { Component, OnInit, Renderer2, OnDestroy, ViewEncapsulation } from '@angular/core';
import { GameService } from 'src/app/main/client/services/game.service';
import gitInfo from 'src/git-version.json';
import { ConfigService } from 'src/app/services/config.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DialogV2Service } from 'src/app/main/client/common/dialog-v2/dialog-v2.service';
import { TGConfig } from 'src/app/main/client/client-config';
import { AudioService } from 'src/app/main/client/components/audio/audio.service';

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

  gitVersion = gitInfo.raw;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private dialogV2Service: DialogV2Service,
    private game: GameService,
    private render: Renderer2,
    private audioService: AudioService,
    private _configService: ConfigService,
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
        this.render.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
        this.render.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
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
        this.render.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
        this.render.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
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
        this.render.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
        this.render.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
      } if (!this.isMatMenuOpen) {
        trigger.closeMenu();
        this.render.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
        this.render.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
      } else {
        this.enteredButton = false;
      }
    }, 100);
  }

  onItemClick(what: string) {

    switch (what) {

      // Client
      case 'disconnect':
        this.game.disconnectGame();
        break;
      // case 'news':
      //   this.dialogV2Service.openNews(true);
      //   break;
      case 'preferences':
        this.dialogV2Service.openControlPanel();
        break;
      case 'audio':
        this.audioService.toggleAudio();
        break;
      case 'log':
        this.dialogV2Service.openLog();
        break;
      default:
        this.game.processCommands(what);
        return false;
    }


  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
