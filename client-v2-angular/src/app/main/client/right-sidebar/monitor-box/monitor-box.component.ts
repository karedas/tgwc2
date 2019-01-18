import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'tg-monitor-box',
  templateUrl: './monitor-box.component.html',
  styleUrls: ['./monitor-box.component.scss'],
})
export class MonitorBoxComponent implements OnInit {

  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;

  constructor( private toastrService: ToastrService) { 
  }

  ngOnInit() {
    this.toastrService.overlayContainer = this.toastContainer;
    setInterval(() => {
      this.toastrService.success('hello im the monitor box', 'toaster fun!');
    }, 2500);
    setInterval(() => {
      this.toastrService.info('hello im the monitor box', 'toaster fun!');
    }, 5500);
    setInterval(() => {
      this.toastrService.error('hello im the monitor box', 'toaster fun!');
    }, 10000);
  }

}
