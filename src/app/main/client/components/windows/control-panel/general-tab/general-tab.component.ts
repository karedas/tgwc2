import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { FileSaverService } from 'ngx-filesaver';
import { font_size_options } from 'src/app/main/client/common/constants';
import { TGConfig } from 'src/app/main/client/client-config';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GameService } from 'src/app/main/client/services/game.service';

@Component({
  selector: 'tg-general-tab',
  templateUrl: './general-tab.component.html',
  styleUrls: ['./general-tab.component.scss']
})
export class GeneralTabComponent implements OnInit, OnDestroy {
  tgConfig: TGConfig;
  fontSizes = font_size_options;
  oldFontSize: number;
  fileUploaded = false;

  private _unsubscribeAll: Subject<any>;


  constructor(
    private configService: ConfigService,
    private fileSaverService: FileSaverService,
    private gameService: GameService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.configService.config
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((config) => {
      this.tgConfig = config;
    });
  }

  onOptionChange(event, value: any) {
    this.configService.setConfig(value);
  }

  changeFontSize(event: any) {
    this.gameService.setOutputSize(event.value);
  }

  saveConfig() {
    const conf = localStorage.getItem('config');
    this.fileSaverService.saveText(conf, 'tgconfig');
  }

  uploadConfig(event: any) {
    const file: any = event.target.files[0];

    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const result = fileReader.result;
        if (typeof result === 'string') {
          const newConf = JSON.parse(result);
          this.configService.setConfig(newConf);

          this.fileUploaded = true;
        }
      };
      fileReader.readAsText(file);
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
