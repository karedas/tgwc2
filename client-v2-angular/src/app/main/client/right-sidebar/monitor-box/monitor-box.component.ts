import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'tg-monitor-box',
  templateUrl: './monitor-box.component.html',
  styleUrls: ['./monitor-box.component.scss'],
})
export class MonitorBoxComponent implements OnInit {

  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;

  constructor(
    private toastrService: ToastrService
  ) {

  }

  ngOnInit() {
    this.toastService.messageObserver.subscribe((msg) => {

    });
    // setTimeout(() => {
    //   this.toastrService.error('Sei stato attaccato!', '', {
    //     closeButton: true,
    //     disableTimeOut: true
    //   });
    // }, 10000);
  }

}
