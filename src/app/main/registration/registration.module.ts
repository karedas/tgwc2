import { NgModule } from '@angular/core';
import { RegistrationComponent } from './registration.component';
import { StepFirstComponent } from './step-first/step-first.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

// Material
import {MatStepperModule} from '@angular/material/stepper'
import {MatRippleModule} from '@angular/material/core';
import { MatSidenavModule, MatButtonModule, MatIconModule, MatFormField, MatFormFieldModule, MatInputModule, MatSliderModule, MatRadioModule } from '@angular/material';
import { StepSecondComponent } from './step-second/step-second.component';
import { StepThirdComponent } from './step-third/step-third.component';
import { StepFourComponent } from './step-four/step-four.component';
import { StepFiveComponent } from './step-five/step-five.component';


export const routes: Routes = [

  { path: '', component: RegistrationComponent, pathMatch: 'full' },

];

@NgModule({
  declarations: [
    RegistrationComponent,
    StepFirstComponent,
    StepSecondComponent,
    StepThirdComponent,
    StepFourComponent,
    StepFiveComponent
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
    MatSliderModule,
    MatRadioModule
  ],

})
export class RegistrationModule { }
