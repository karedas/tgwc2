import { NgModule } from '@angular/core';
import { StepFirstComponent } from './wizard/step-first/step-first.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

// Material
import {MatStepperModule} from '@angular/material/stepper'
import {MatRippleModule} from '@angular/material/core';
import { MatSidenavModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatRadioModule, MatDividerModule } from '@angular/material';
import { StepSecondComponent } from './wizard/step-second/step-second.component';
import { StepThirdComponent } from './wizard/step-third/step-third.component';
import { StepFourComponent } from './wizard/step-four/step-four.component';
import { StepFiveComponent } from './wizard/step-five/step-five.component';
import { StepSixComponent } from './wizard/step-six/step-six.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SummaryRegistrationComponent } from './summary-registration/summary-registration.component';
import { RegistrationService } from './services/registration.service';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { WizardComponent } from './wizard/wizard.component';

export const routes: Routes = [
  {
    path: 'nuovo',
    component: WizardComponent,
    children:[],
    resolve: {
      dataReg: RegistrationService
    }
  },
  {
    path: 'riepilogo', 
    component: SummaryRegistrationComponent,
    resolve: {
      dataReg: RegistrationService
    }
  },
  {
    path: '**',
    redirectTo: 'wizard'
  }
];

@NgModule({
  declarations: [
    StepFirstComponent,
    StepSecondComponent,
    StepThirdComponent,
    StepFourComponent,
    StepFiveComponent,
    StepSixComponent,
    SummaryRegistrationComponent,
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
    MatDividerModule,
    NgScrollbarModule,
    PipesModule
  ],
  providers: [
    RegistrationService
  ]
})
export class RegistrationModule { }