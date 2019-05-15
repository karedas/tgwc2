import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MainComponent } from './main.component';
import { Auth2Module } from './authentication/auth.module';
import { SocketService } from '../services/socket.service';

@NgModule({
  declarations: [
    MainComponent,
  ],
  imports: [
    SharedModule,
    Auth2Module,
  ],
  exports: [
    MainComponent,
  ],
})
export class MainModule {}
