import { NgModule } from '@angular/core';
import { LoginModule } from './login/login.module';
import { AskQuestionModule } from './question-box/ask-question/ask-question.module';
import { ShowQuestionsModule } from './question-box/show-questions/show-questions.module';
import { SurveyWellcomeModule } from './survey/survey-wellcome/survey-wellcome.module';


@NgModule({
    imports: [
        AskQuestionModule,
        LoginModule,
        ShowQuestionsModule,
        SurveyWellcomeModule
    ]
})
export class RoutableComponentsModule { }


