import { NgModule } from "@angular/core";
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { DataTableComponent } from './dataTable.component';

@NgModule({
    imports: [
        MatInputModule,
        MatFormFieldModule,
    ],
    declarations: [
        DataTableComponent
    ],
    exports: [
        DataTableComponent
    ]
})

export class DataTableModule { }

