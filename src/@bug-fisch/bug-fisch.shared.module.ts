import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
    imports:[
        CommonModule,
        FlexLayoutModule
    ],
    exports:[
        CommonModule,
        FlexLayoutModule
    ]
})
export class BugFischSharedModule { }