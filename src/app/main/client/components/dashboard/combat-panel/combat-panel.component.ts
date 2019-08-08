import { Component, ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'tg-combat-panel',
  templateUrl: './combat-panel.component.html',
  styleUrls: ['./combat-panel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CombatPanelComponent {


  @Input('enemyHealt') enemyHealt: number;
  @Input('enemyMove') enemyMove: number;
  @Input('enemyIcon') enemyIcon: number | null;
  @Input('enemyName') enemyName: string;

}
