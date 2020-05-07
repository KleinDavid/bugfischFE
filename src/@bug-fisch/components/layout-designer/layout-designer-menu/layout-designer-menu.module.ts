import { NgModule } from "@angular/core";
import { BugFischSharedModule } from 'src/@bug-fisch/bug-fisch.shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { LayoutDesignerMenuLeftComponent } from './menu-left/menu-left.component';
import { LayoutDesignerMenuRightComponent } from './menu-right/menu-right.component';
import { LayoutDesignerMenuTopComponent } from './menu-top/menu-top.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { MatRadioModule } from '@angular/material/radio'
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule, MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
    imports: [
        MatButtonModule,
        MatInputModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatProgressSpinnerModule,
        MatIconModule,
        YouTubePlayerModule,
        MatRadioModule,
        MatInputModule,
        MatFormFieldModule,
        MatOptionModule,
        MatNativeDateModule,
        FormsModule,
        MatSelectModule,
        MatTabsModule,

        MatFormFieldModule,
        BugFischSharedModule,
        BrowserModule,
        DragDropModule,
        ColorPickerModule
    ],
    declarations: [
        LayoutDesignerMenuLeftComponent,
        LayoutDesignerMenuRightComponent,
        LayoutDesignerMenuTopComponent,
    ],
    exports: [
        LayoutDesignerMenuLeftComponent,
        LayoutDesignerMenuRightComponent,
        LayoutDesignerMenuTopComponent,
    ]
})

export class LayoutDesignerMenuModule { }

