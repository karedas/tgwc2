import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tg-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {

  showed: boolean = false;

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      this.showed = !this.showed;
    }, 3000);
  }

}
