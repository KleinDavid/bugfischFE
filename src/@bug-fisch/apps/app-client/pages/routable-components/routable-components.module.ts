import { NgModule } from '@angular/core';
import { LoginModule } from './login/login.module';
import { AskQuestionModule } from './ask-question/ask-question.module';
import { ShowQuestionsModule } from './show-questions/show-questions.module';


@NgModule({
    imports: [
        AskQuestionModule,
        LoginModule,
        ShowQuestionsModule
    ]
})
export class RoutableComponentsModule { }


