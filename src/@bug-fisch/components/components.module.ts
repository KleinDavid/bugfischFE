import { NgModule } from '@angular/core';
import { InputModule } from './input/input.module';
import { ActionButtonModule } from './action-button/action-button.module';
import { SelectModule } from './select/select.module';
import { DataTableModule } from './dataTable/dataTable.module';
import { TextModule } from './text/text.module';
import { QuestionsModule } from './questions/questions.module';
import { YoutubePlayerModule } from './youtubePlayer/youtubePlayer.module';
import { LayoutDesignerModule } from './layout-designer/layout-designer.module';


@NgModule({
    imports: [
        InputModule,
        ActionButtonModule,
        SelectModule,
        DataTableModule,
        TextModule,
        QuestionsModule,
        YoutubePlayerModule,
        LayoutDesignerModule
    ],
    exports: [
        InputModule,
        ActionButtonModule,
        SelectModule,
        DataTableModule,
        TextModule,
        QuestionsModule,
        YoutubePlayerModule,
        LayoutDesignerModule
    ]
})
export class ComponentsModule { }