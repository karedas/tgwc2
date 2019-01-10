import { Component, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { DataState } from 'src/app/store/state/data.state';
import * as fromSelectors from 'src/app/store/selectors';
import { filter} from 'rxjs/operators';
import { NgScrollbar } from 'ngx-scrollbar';
import { jqxSplitterComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxsplitter';

@Component({
  selector: 'tg-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.scss'],
})

export class OutputComponent implements AfterViewInit{

  @ViewChild('scrollBar') scrollBar: NgScrollbar;
  @ViewChild('nestedSplitter') splitterpanel: jqxSplitterComponent;
  
  output = [];

  private outputTrimLines: number = 500;
  constructor(private store: Store<DataState>) {}
  
  ngAfterViewInit() {
    //Listen Base Text Data
    this.store.pipe(select(fromSelectors.getDataBase)).subscribe(
        (base: string[]) => {
          const content = this.getContentObject('base', base[0]);
          this.output.push(content);
          // You might need to give a tiny delay before updating the scrollbar
            this.scrollPanelToBottom();
        },
      )
      
    this.store.select(fromSelectors.getRoomBase)
      .pipe(filter(room => room && room !== undefined))
      .subscribe(
        (room: any) => {
          const content = this.getContentObject('room', room);
          this.output.push(content);
          this.trimOutput();
          this.scrollPanelToBottom();
        }
      )
  }

  public resizeSplitterPanel(event: any){
    return;
  }

  private getContentObject(t: string, c: any): any {
    return Object.assign({}, {type: t, content: c})
  }

  private trimOutput(): void {
    if(this.output.length > this.outputTrimLines) {
      this.output = this.output.slice(1, this.output.length);
    }
  }

  private scrollPanelToBottom() {
    setTimeout(() => {
      this.scrollBar.scrollToBottom(0);
    }, 15);
  }
}
