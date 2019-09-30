import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'tg-base-window',
  templateUrl: './base-window.component.html',
  styleUrls: ['./base-window.component.scss']
})
export class BaseWindowComponent implements OnInit {

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data
  ) { 
    console.log(data);
  }

  ngOnInit() {
  }

}
