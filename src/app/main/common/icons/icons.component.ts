import { Component, Input, ViewEncapsulation, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'tg-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IconsComponent implements OnChanges {
  @Input('icon') icon: number;

  bgPositionStyle: Object;

  ngOnChanges(changes: SimpleChanges): void {
    
    this.icon = +this.icon;
    if (this.icon === 0) {
      // Get Default Tg-icon
      this.icon = 416;
    }

    this.setTileBackgroundPosition();
  }

  private setTileBackgroundPosition() {
    const tc = this.tileCoords();
    this.bgPositionStyle = {
      'background-position': `-${tc[0]}px -${tc[1]}px`
    };
  }

  private tileCoords(): number[] {
    const posx = 32 * (this.icon & 0x7f);
    const posy = 32 * (this.icon >> 7);

    return [posx, posy];
  }
}
