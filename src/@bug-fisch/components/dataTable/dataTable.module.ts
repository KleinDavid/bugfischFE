import { NgModule } from "@angular/core";
import { DataTableComponent } from './dataTable.component';
import { BugFischSharedModule } from 'src/@bug-fisch/bug-fisch.shared.module';
import { MatTableModule, MatPaginatorModule, MatProgressSpinnerModule, MatSortModule, MatInputModule, MatFormFieldModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
    imports: [
        MatInputModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatProgressSpinnerModule,

        MatFormFieldModule,
        BugFischSharedModule,
        BrowserModule,
        MatSortModule,
        MatTableModule
    ],
    declarations: [
        DataTableComponent
    ],
    exports: [
        DataTableComponent
    ]
})

export class DataTableModule { }

