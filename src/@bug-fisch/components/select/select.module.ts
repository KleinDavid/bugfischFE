import { NgModule } from "@angular/core";
import { MatInputModule } from '@angular/material/input';
import {MatFormFieldModule, MatFormField} from '@angular/material/form-field'
import { SelectComponent } from './select.component';
import { BugFischSharedModule } from 'src/@bug-fisch/bug-fisch.shared.module';
import { FormsModule } from '@angular/forms';
import { MatOptionModule, MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
    imports: [
        BugFischSharedModule,
        MatInputModule,
        MatFormFieldModule,
        MatOptionModule,
        MatNativeDateModule,
        FormsModule,
        MatSelectModule,
    ],
    declarations: [
        SelectComponent
    ],
    exports: [
        SelectComponent
    ]
})

export class SelectModule { }

