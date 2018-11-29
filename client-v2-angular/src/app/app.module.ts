import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { ClientModule } from './client/client.module';
import { SocketService } from './services/socket.service';
import { CookieService } from 'ngx-cookie-service';




@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ClientModule
  ],
  providers: [SocketService, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
