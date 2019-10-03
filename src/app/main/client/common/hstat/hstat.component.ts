import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'tg-hstat',
  templateUrl: './hstat.component.html',
  styleUrls: ['./hstat.component.scss']
})
export class HstatComponent implements OnChanges {

  @Input('condprc') condprc: number;
  bgPos: string;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.setHsStatBgPos();
  }

  setHsStatBgPos() {
    const pos = -13 * Math.floor(11 * (100 - this.condprc) / 100);
    this.bgPos = `0 ${pos}px`;
  }
}
