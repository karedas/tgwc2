import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { Subject } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/api-response.model';

@Component({
  selector: 'tg-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements AfterViewInit {

  userProfile: Subject<any>
  constructor(private profileService: ProfileService) {

   }

  ngAfterViewInit(): void {
    this.profileService.getAbout()
      .then((profile: any) => {
        this.userProfile = profile.data;
      }) 
  }

}
