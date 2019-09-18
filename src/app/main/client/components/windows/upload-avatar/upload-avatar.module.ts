import { NgModule } from '@angular/core';
import { MatFileUploadModule } from 'angular-material-fileupload';
import { UploadAvatarComponent } from './upload-avatar.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    UploadAvatarComponent 
  ],
  imports: [
    MatFileUploadModule,
    SharedModule,
  ],
  exports:[
    UploadAvatarComponent
  ],
  entryComponents: [
    UploadAvatarComponent
  ]
})
export class UploadAvatarModule { }
