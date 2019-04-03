import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { CookieLawComponent } from '../../client/windows/cookie-law/cookie-law.component';
import { Observable } from 'rxjs';
import { NewsComponent } from '../../client/windows/news/news.component';

@Injectable({
  providedIn: 'root'
})
export class DialogV2Service {

  constructor(public dialog: MatDialog) { }

  openCookieLaw(): MatDialogRef<CookieLawComponent, MatDialogConfig>{

    let config = new MatDialogConfig();
    config = {
      disableClose: true,
      width: '450px',
    };
    
    const dialogRef = this.dialog.open(CookieLawComponent, config );
    return dialogRef;
  }
  
  openNews(): void{

    // this.render.addClass(document.body, 'overlay-dark')
    let config = new MatDialogConfig();
    config.disableClose = true;
    config.width = '750px';
    config.height = '600px';
    config.backdropClass = 'overlay-dark';

    const ref = this.dialog.open(NewsComponent, config);
  
    //   ref.onClose.subscribe(
    //     () => this.render.removeClass(document.body, 'overlay-dark')
    //   );
  
    //   this.dd.set(ref, 'welcomenews');
  
  }
}
