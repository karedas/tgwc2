import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { DataState } from 'src/app/store/state/data.state';
import { getHero } from 'src/app/store/selectors';
import { tap } from 'rxjs/operators';
import { LoginService } from 'src/app/main/authentication/services/login.service';

@Component({
  selector: 'tg-monitor-box',
  templateUrl: './monitor-box.component.html',
  styleUrls: ['./monitor-box.component.scss'],
})
export class MonitorBoxComponent implements OnInit {

  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;

  constructor() {

  }

  ngOnInit() {

    // setTimeout(() => {
    //   this.toastrService.error('Sei stato attaccato!', '', {
    //     closeButton: true,
    //     disableTimeOut: true
    //   });
    // }, 10000);
  }

}
