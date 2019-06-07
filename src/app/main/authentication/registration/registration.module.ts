import { NgModule } from '@angular/core';
import { StepFirstComponent } from './wizard/step-first/step-first.component';
import { Routes, RouterModule } from '@angular/router';
// Material
import { MatStepperModule } from '@angular/material/stepper';
import { StepSecondComponent } from './wizard/step-second/step-second.component';
import { StepThirdComponent } from './wizard/step-third/step-third.component';
import { StepFourComponent } from './wizard/step-four/step-four.component';
import { StepFiveComponent } from './wizard/step-five/step-five.component';
import { StepSixComponent } from './wizard/step-six/step-six.component';
import { SummaryRegistrationComponent } from './summary-registration/summary-registration.component';
import { RegistrationService } from './services/registration.service';
import { WizardComponent } from './wizard/wizard.component';
import { WelcomeRegistrationComponent } from './welcome-registration/welcome-registration.component';
import { RegistrationComponent } from './registration.component';
import { SharedModule } from 'src/app/shared/shared.module';


export const routes: Routes = [

  {
    path: '',
    component: RegistrationComponent,
    children: [
      {
        path: 'benvenuto',
        component: WelcomeRegistrationComponent,
      },
      {
        path: 'riepilogo',
        component: SummaryRegistrationComponent,
        resolve:
          { reg: RegistrationService }
      },
      {
        path: 'wizard',
        component: WizardComponent,
        resolve:
          { reg: RegistrationService }
      },
      {
        path: '',
        redirectTo: 'benvenuto'
      },
    ],
  },
];

@NgModule({
  declarations: [
    StepFirstComponent,
    StepSecondComponent,
    StepThirdComponent,
    StepFourComponent,
    StepFiveComponent,
    StepSixComponent,
    RegistrationComponent,
    SummaryRegistrationComponent,
    WizardComponent,
    WelcomeRegistrationComponent,

  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    MatStepperModule
  ],
  exports: [
    RouterModule
  ],
  providers: [
    RegistrationService
  ]
})
export class RegistrationModule { }
