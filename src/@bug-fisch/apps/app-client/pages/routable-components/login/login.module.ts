import { NgModule } from "@angular/core";
import { LoginComponent } from "./login.component"
import { BugFischSharedModule } from 'src/@bug-fisch/bug-fisch.shared.module';
import { ComponentsModule } from 'src/@bug-fisch/components/components.module';

@NgModule({
    imports: [
        BugFischSharedModule,
        ComponentsModule
    ],
    declarations: [
        LoginComponent
    ],
    exports: [
        LoginComponent
    ],
    providers: [
        LoginComponent
    ],
    entryComponents: [
        LoginComponent
    ]
})

export class LoginModule {}

