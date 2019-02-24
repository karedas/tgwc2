import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'tg-combat-panel',
  templateUrl: './combat-panel.component.html',
  styleUrls: ['./combat-panel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CombatPanelComponent implements OnInit {


  @Input('enemyHealt') healt: number;
  @Input('enemyMove') move: number;
  @Input('enemyIcon') icon: number | null;
  @Input('enemyName') name: string;

  constructor() { }

  ngOnInit() {
  }

}
