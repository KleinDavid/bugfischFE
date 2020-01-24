import { NgModule } from "@angular/core";
import { InputComponent } from "./input.component";
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { BugFischSharedModule } from 'src/@bug-fisch/bug-fisch.shared.module';

@NgModule({
    imports: [
        MatInputModule,
        MatFormFieldModule,
        BugFischSharedModule
    ],
    declarations: [
        InputComponent
    ],
    exports: [
        InputComponent
    ]
})

export class InputModule { }

