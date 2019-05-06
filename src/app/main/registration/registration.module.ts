import { NgModule } from '@angular/core';
import { RegistrationComponent } from './registration.component';
import { StepFirstComponent } from './step-first/step-first.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

// Material
import {MatStepperModule, matStepperAnimations} from '@angular/material/stepper'
import {MatRippleModule} from '@angular/material/core';
import { MatSidenavModule, MatButtonModule, MatIconModule, MatFormField, MatFormFieldModule, MatInputModule, MatSliderModule } from '@angular/material';
import { RegistrationService } from './services/registration.service';
import { StepSecondComponent } from './step-second/step-second.component';
import { StepThirdComponent } from './step-third/step-third.component';


export const routes: Routes = [

  { path: '', component: RegistrationComponent, pathMatch: 'full' },

];

@NgModule({
  declarations: [
    RegistrationComponent,
    StepFirstComponent,
    StepSecondComponent,
    StepThirdComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatIconModule,
    MatRippleModule,
    MatStepperModule,
    MatSidenavModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule
  ],
  exports: [
    RegistrationComponent,
  ],
})
export class RegistrationModule { }
