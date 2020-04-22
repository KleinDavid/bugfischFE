import { NgModule } from "@angular/core";
import { BugFischSharedModule } from 'src/@bug-fisch/bug-fisch.shared.module';
import { ComponentsModule } from 'src/@bug-fisch/components/components.module';
import { PredigtStartseiteComponent } from './predigt-startseite.component';

@NgModule({
    imports: [
        BugFischSharedModule,
        ComponentsModule
    ],
    declarations: [
        PredigtStartseiteComponent
    ],
    exports: [
        PredigtStartseiteComponent
    ],
    providers: [
        PredigtStartseiteComponent
    ],
    entryComponents: [
        PredigtStartseiteComponent
    ]
})

export class PredigtStartseiteModule {}

