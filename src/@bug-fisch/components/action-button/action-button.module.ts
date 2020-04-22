import { NgModule } from "@angular/core";
import { ActionButtonComponent } from "./action-button.component";
import { BugFischSharedModule } from 'src/@bug-fisch/bug-fisch.shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
    imports: [
        MatButtonModule,
        MatInputModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatProgressSpinnerModule,

        MatFormFieldModule,
        BugFischSharedModule,
        BrowserModule
    ],
    declarations: [
        ActionButtonComponent
    ],
    exports: [
        ActionButtonComponent
    ]
})

export class ActionButtonModule { }

