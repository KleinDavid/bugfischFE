import { NgModule } from '@angular/core';
import { ClientPagesModule } from './apps/app-client/pages/client-pages.module';
import { BugFischSharedModule } from './bug-fisch.shared.module';


@NgModule({
    imports:[
        ClientPagesModule,
        BugFischSharedModule
    ]
})
export class BugFischModule { }