import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { Shell } from '@app/shell/shell.service';
import { SignupComponent } from './signup.component';
import { BasicInfoComponent } from './basic-info/basic-info.component';

const routes: Routes = [
  Shell.childRoutes([{ path: 'signup', component: SignupComponent, data: { title: marker('Signup') } }]),
  Shell.childRoutes([{ path: 'signup/basic-info', component: BasicInfoComponent, data: { title: marker('Signup') } }]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class SignupRoutingModule {}
