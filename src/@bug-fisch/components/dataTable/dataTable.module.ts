import { NgModule } from "@angular/core";
import { DataTableComponent } from './dataTable.component';
import { BugFischSharedModule } from 'src/@bug-fisch/bug-fisch.shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';

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
    ],
    declarations: [
        DataTableComponent
    ],
    exports: [
        DataTableComponent
    ]
})

export class DataTableModule { }

