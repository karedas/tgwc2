import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ClientComponent } from "./client.component";

const clientRouting: Routes = [{
        path: '',
        component: ClientComponent,
        children: [{
            path: '',
            redirectTo: 'login',
            pathMatch: 'full'
        }],
    }, { 
        path: 'login',
        redirectTo: 'auth/login',
        pathMatch: 'full'
    }, {
        path: '**',
        redirectTo: 'game'
    }
]

@NgModule({
    imports: [RouterModule.forChild(clientRouting)],
    exports: [RouterModule]
})

export class ClientRoutingModule {}
