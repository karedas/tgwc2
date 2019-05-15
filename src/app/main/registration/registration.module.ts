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
import { StepCompleteComponent } from './step-complete/step-complete.component';
import { RegistrationService } from './services/registration.service';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalizeFirst';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { WizardComponent } from './wizard/wizard.component';


export const routes: Routes = [

  { path: '', component: RegistrationComponent, pathMatch: 'full' },
  { path: 'summary', component: StepCompleteComponent , pathMatch: 'full' },

];

@NgModule({
  declarations: [
    RegistrationComponent,
    StepFirstComponent,
    StepSecondComponent,
    StepThirdComponent,
    StepFourComponent,
    StepFiveComponent,
    StepSixComponent,
    StepCompleteComponent,
    WizardComponent,
    
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
    NgScrollbarModule,
    PipesModule
  ],
  providers: [
    RegistrationService,
  ]
})
export class RegistrationModule { }
