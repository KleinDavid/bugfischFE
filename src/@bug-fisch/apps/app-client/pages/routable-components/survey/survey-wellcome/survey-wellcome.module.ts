import { NgModule } from "@angular/core";
import { BugFischSharedModule } from 'src/@bug-fisch/bug-fisch.shared.module';
import { ComponentsModule } from 'src/@bug-fisch/components/components.module';
import { SurveyWellcomeComponent } from './survey-wellcome.component';

@NgModule({
    imports: [
        BugFischSharedModule,
        ComponentsModule
    ],
    declarations: [
        SurveyWellcomeComponent
    ],
    exports: [
        SurveyWellcomeComponent
    ],
    providers: [
        SurveyWellcomeComponent
    ],
    entryComponents: [
        SurveyWellcomeComponent
    ]
})

export class SurveyWellcomeModule { }

