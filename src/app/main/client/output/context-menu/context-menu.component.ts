import { Component, OnInit } from '@angular/core';
// import { MenuItem } from 'primeng/api';

@Component({
  selector: 'tg-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit {


  // @Input('model')  model: MenuItem[];
  // public items: MenuItem[];
  public readonly target: string;

  constructor() {

    // this.items = [
    //   { label: 'Prendi', icon: 'pi pi-fw pi-times' },
    //   { label: 'Indossa', icon: 'pi pi-fw pi-times'},
    //   { label: 'Posa', icon: 'pi pi-fw pi-times'}
    // ];

  }

  ngOnInit() {
  }

}
