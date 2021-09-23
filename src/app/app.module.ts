import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
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
import { ConfigService } from 'src/@bug-fisch/services/config.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
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
    RestService,
    ConfigService,
    { provide: APP_INITIALIZER, useFactory: ConfigServiceFactory, deps: [ConfigService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function ConfigServiceFactory(configService: ConfigService) {
  return () => configService.loadConfig();
}
