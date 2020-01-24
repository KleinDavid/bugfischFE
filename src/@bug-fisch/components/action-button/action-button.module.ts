import { NgModule } from "@angular/core";
import { ActionButtonComponent } from "./action-button.component";
import { MatButtonModule } from '@angular/material';

@NgModule({
    imports: [
        MatButtonModule
    ],
    declarations: [
        ActionButtonComponent
    ],
    exports: [
        ActionButtonComponent
    ]
})

export class ActionButtonModule { }

