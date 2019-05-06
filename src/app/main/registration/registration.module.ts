import { NgModule } from '@angular/core';
import { RegistrationComponent } from './registration.component';
import { StepFirstComponent } from './step-first/step-first.component';
import { Routes, RouterModule } from '@angular/router';


export const routes: Routes = [

  { path: 'registrazione', component: RegistrationComponent, pathMatch: 'full' },

];

@NgModule({
  declarations: [
    RegistrationComponent,
    StepFirstComponent
  ],
  imports: [
    // RouterModule.forChild(routes)
  ],
  exports: [
    RegistrationComponent,
    // RouterModule
  ]
})
export class RegistrationModule { }
