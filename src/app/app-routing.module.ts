import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DynamicPageComponent } from 'src/@bug-fisch/apps/app-client/pages/dynamic-page/dynamic-page.component';

const routes: Routes = 
[
  { path: 'app', component: DynamicPageComponent },
  { path: '', redirectTo: 'app', pathMatch: 'full' }
]
// [
//   {
//     path: '',
//     component: DynamicPageComponent,
//     data: { }
//   }, 
// ];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  // exports: [RouterModule]
})
export class AppRoutingModule { }
