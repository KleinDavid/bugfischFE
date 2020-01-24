import { NgModule } from "@angular/core";
import { BugFischSharedModule } from 'src/@bug-fisch/bug-fisch.shared.module';
import { ComponentsModule } from 'src/@bug-fisch/components/components.module';
import { ShowQuestionsComponent } from './show-questions.component';

@NgModule({
    imports: [
        BugFischSharedModule,
        ComponentsModule
    ],
    declarations: [
        ShowQuestionsComponent
    ],
    exports: [
        ShowQuestionsComponent
    ],
    providers: [
        ShowQuestionsComponent
    ],
    entryComponents: [
        ShowQuestionsComponent
    ]
})

export class ShowQuestionsModule { }

