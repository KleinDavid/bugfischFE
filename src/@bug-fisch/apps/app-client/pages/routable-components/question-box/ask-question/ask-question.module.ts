import { NgModule } from "@angular/core";
import { AskQuestionComponent } from "./ask-question.component";
import { BugFischSharedModule } from 'src/@bug-fisch/bug-fisch.shared.module';
import { ComponentsModule } from 'src/@bug-fisch/components/components.module';

@NgModule({
    imports: [
        BugFischSharedModule,
        ComponentsModule
    ],
    declarations: [
        AskQuestionComponent
    ],
    exports: [
        AskQuestionComponent
    ],
    providers: [
        AskQuestionComponent
    ],
    entryComponents: [
        AskQuestionComponent
    ]
})

export class AskQuestionModule { }

