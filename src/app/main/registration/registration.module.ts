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
import { MatSidenavModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatRadioModule } from '@angular/material';
import { StepSecondComponent } from './step-second/step-second.component';
import { StepThirdComponent } from './step-third/step-third.component';
import { StepFourComponent } from './step-four/step-four.component';
import { StepFiveComponent } from './step-five/step-five.component';
import { StepSixComponent } from './step-six/step-six.component';
import { NgScrollbarModule } from 'ngx-scrollbar';


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
    StepFiveComponent,
    StepSixComponent
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
    MatRadioModule,
    NgScrollbarModule
  ],

})
export class RegistrationModule { }
