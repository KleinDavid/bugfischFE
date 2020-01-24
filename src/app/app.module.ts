import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from "@angular/common";
import { AuthInterceptor } from 'src/@bug-fisch/interceptor/auth.interceptor';
import { Routes, RouterModule } from '@angular/router';
import { DynamicPageComponent } from 'src/@bug-fisch/apps/app-client/pages/dynamic-page/dynamic-page.component';
import { DynamicPageModule } from 'src/@bug-fisch/apps/app-client/pages/dynamic-page/dynamic-page.module';
import { ActionService } from 'src/@bug-fisch/services/action.service';
import { DataService } from 'src/@bug-fisch/services/data.service';
import { RestService } from 'src/@bug-fisch/services/rest.service';

const appRoutes: Routes = [
  {
    path: 'startt',
    component: DynamicPageComponent,
    data: { title: 'Heroes List' }
  },
  { path: '',
    redirectTo: '/startt',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    DynamicPageModule,
    BrowserModule,
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule, 
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    ActionService,
    DataService,
    RestService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
