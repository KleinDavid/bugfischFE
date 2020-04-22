import { NgModule } from '@angular/core';
import { LoginModule } from './login/login.module';
import { AskQuestionModule } from './question-box/ask-question/ask-question.module';
import { ShowQuestionsModule } from './question-box/show-questions/show-questions.module';
import { SurveyWellcomeModule } from './survey/survey-wellcome/survey-wellcome.module';
import { SurveyQuestionModule } from './survey/survey-question/survey-question.module';
import { SurveyEndModule } from './survey/survey-end/survey-end.module';
import { PredigtStartseiteModule } from './predigt/predigt-startseite/predigt-startseite.module';


@NgModule({
    imports: [
        AskQuestionModule,
        LoginModule,
        ShowQuestionsModule,
        SurveyWellcomeModule,
        SurveyQuestionModule,
        SurveyEndModule,
        PredigtStartseiteModule
    ]
})
export class RoutableComponentsModule { }


