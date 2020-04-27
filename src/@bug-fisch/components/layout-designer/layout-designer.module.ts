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
import { LayoutDesignerMenuModule } from './layout-designer-menu/layout-designer-menu.module';
import { LayoutDesignerComponent } from './layout-designer.component';
import { HTMLDialog } from './html-dialog/html-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    imports: [
        MatButtonModule,
        MatInputModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatDialogModule,
        YouTubePlayerModule,
        LayoutDesignerMenuModule,

        MatFormFieldModule,
        BugFischSharedModule,
        BrowserModule,
        DragDropModule,
    ],
    declarations: [
        LayoutDesignerComponent,
        HTMLDialog
    ],
    exports: [
        LayoutDesignerComponent,
        LayoutDesignerMenuModule,
        HTMLDialog
    ]
})

export class LayoutDesignerModule { }

