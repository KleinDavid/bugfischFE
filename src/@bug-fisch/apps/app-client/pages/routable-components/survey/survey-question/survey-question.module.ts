import { NgModule } from "@angular/core";
import { BugFischSharedModule } from 'src/@bug-fisch/bug-fisch.shared.module';
import { ComponentsModule } from 'src/@bug-fisch/components/components.module';
import { SurveyQuestionComponent } from './survey-question.component';
import { ActionButtonModule } from 'src/@bug-fisch/components/action-button/action-button.module';

@NgModule({
    imports: [
        BugFischSharedModule,
        ActionButtonModule,
        ComponentsModule
    ],
    declarations: [
        SurveyQuestionComponent
    ],
    exports: [
        SurveyQuestionComponent
    ],
    providers: [
        SurveyQuestionComponent
    ],
    entryComponents: [
        SurveyQuestionComponent
    ]
})

export class SurveyQuestionModule { }

