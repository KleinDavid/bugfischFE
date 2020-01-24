import { NgModule } from '@angular/core';
import { DynamicPageModule } from './dynamic-page/dynamic-page.module';
import { RoutableComponentsModule } from './routable-components/routable-components.module';


@NgModule({
    imports:[
        DynamicPageModule,
        RoutableComponentsModule
    ]
})
export class ClientPagesModule { }