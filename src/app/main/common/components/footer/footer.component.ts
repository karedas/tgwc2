import { Component, OnInit, OnDestroy } from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { Subject, Observable, Subscription } from "rxjs";
import { SocketService } from "src/app/core/services/socket.service";
import { Router, NavigationStart } from "@angular/router";
import { versions } from "src/environments/versions";
import { GameService } from "src/app/main/client/services/game.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "tg-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"]
})
export class FooterComponent implements OnInit, OnDestroy {
  showFooter = true;
  serverStat: Observable<any>;
  gitVersion = versions.tag;
  serverStatusMessage: boolean;

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private socketService: SocketService,
    private router: Router,
    private gameService: GameService
  ) {
    if (environment.production) {
      this.serverStat = this.gameService.serverStat;
    }
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.router.events.subscribe(e => {
      if (e instanceof NavigationStart) {
        if (e.url === "/webclient") {
          this.showFooter = false;
        } else {
          this.showFooter = true;
        }
      }
    });

    // Show Socket Error to notice user about Server Errors
    this.socketService.socket_error$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((serverstatus: boolean) => {
        this.serverStatusMessage = !serverstatus;
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
