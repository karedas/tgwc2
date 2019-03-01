import { Component, Input, AfterViewInit, SimpleChange } from '@angular/core';

@Component({
  selector: 'tg-hstat',
  templateUrl: './hstat.component.html',
  styleUrls: ['./hstat.component.scss']
})
export class HstatComponent {

  @Input('condprc') condprc: number;
  bgPos: string;

  constructor() { }

  ngOnChanges(changes: SimpleChange): void {
    this.setHsStatBgPos();
  }

  setHsStatBgPos() {
    const pos = -13 * Math.floor(12 * (100 - this.condprc) / 100);
    this.bgPos = `0 ${pos}px`;
  }


}
