import { NgModule } from '@angular/core';
import { InputModule } from './input/input.module';
import { ActionButtonModule } from './action-button/action-button.module';
import { SelectModule } from './select/select.module';
import { BrowserModule } from '@angular/platform-browser'
import { DataTableModule } from './dataTable/dataTable.module';
import { TextModule } from './text/text.module';


@NgModule({
    imports: [
        InputModule,
        ActionButtonModule,
        SelectModule,
        DataTableModule,
        TextModule
    ],
    exports: [
        InputModule,
        ActionButtonModule,
        SelectModule,
        DataTableModule,
        TextModule
    ]
})
export class ComponentsModule { }