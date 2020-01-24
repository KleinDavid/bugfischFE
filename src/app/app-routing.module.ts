import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DynamicPageComponent } from 'src/@bug-fisch/apps/app-client/pages/dynamic-page/dynamic-page.component';

const routes: Routes = [
  {
    path: '',
    component: DynamicPageComponent,
    data: { }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
