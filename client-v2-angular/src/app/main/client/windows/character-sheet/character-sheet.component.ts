import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { IHero } from 'src/app/models/data/hero.model';
import { DataState } from 'src/app/store/state/data.state';
import { Store, select } from '@ngrx/store';
import { getHero } from 'src/app/store/selectors';
import { environment } from 'src/environments/environment.prod';
import { NgScrollbar } from 'ngx-scrollbar';

@Component({
  selector: 'tg-character-sheet',
  templateUrl: './character-sheet.component.html',
  styleUrls: ['./character-sheet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterSheetComponent implements AfterViewInit{

  @ViewChild(NgScrollbar) textAreaScrollbar: NgScrollbar;

  imageBaseUrl: string = environment.media_address;
  heroInfo$: Observable<IHero>;

  constructor(
    private store: Store<DataState>
  ) {
    this.heroInfo$ = this.store.pipe(select(getHero));
   }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.textAreaScrollbar.update();
    }, 200); 
  }


  parseDesc(value: string): string {
    return value.replace(/([.:?!,])\s*\n/gm, '$1').replace(/\r?\n|\r/g, '');
  }

}
