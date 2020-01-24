import { NgModule } from "@angular/core";
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { SelectComponent } from './select.component';
import { MatSelectModule, MatOptionModule, MatNativeDateModule } from '@angular/material';
import { BugFischSharedModule } from 'src/@bug-fisch/bug-fisch.shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        BugFischSharedModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatNativeDateModule,
        FormsModule,
    ],
    declarations: [
        SelectComponent
    ],
    exports: [
        SelectComponent
    ]
})

export class SelectModule { }

