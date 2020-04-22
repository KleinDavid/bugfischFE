import { NgModule } from "@angular/core";
import { BugFischSharedModule } from 'src/@bug-fisch/bug-fisch.shared.module';
import { ComponentsModule } from 'src/@bug-fisch/components/components.module';
import { SurveyEndComponent } from './survey-end.component';

@NgModule({
    imports: [
        BugFischSharedModule,
        ComponentsModule
    ],
    declarations: [
        SurveyEndComponent
    ],
    exports: [
        SurveyEndComponent
    ],
    providers: [
        SurveyEndComponent
    ],
    entryComponents: [
        SurveyEndComponent
    ]
})

export class SurveyEndModule { }

