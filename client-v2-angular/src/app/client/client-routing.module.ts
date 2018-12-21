import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "../authentication/services/login.guard";
import { ClientContainerComponent } from "./client-container/client-container.component";

const clientRouting: Routes = [
	{
		path: '',
		redirectTo: 'login',
		pathMatch: 'full'
	},
	{ 
		path: 'webclient', 
		component: ClientContainerComponent, 
		pathMatch: 'full',
		canActivate: [AuthGuard] 
	}
]

@NgModule({
	imports: [RouterModule.forChild(clientRouting)],
	exports: [RouterModule]
})

export class ClientRoutingModule { }
