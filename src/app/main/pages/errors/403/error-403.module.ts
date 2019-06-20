import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material';

import { Error403Component } from 'src/app/main/pages/errors/403/error-403.component';
import { SharedModule } from 'src/app/shared/shared.module';

const routes = [
    {
        path: 'errors/error-403',
        component: Error403Component,
    }
];

@NgModule({
    declarations: [
        Error403Component
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        MatIconModule
    ]
})
export class Error403Module {
}
