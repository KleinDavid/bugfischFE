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
import { MatDialogModule } from '@angular/material/dialog';
import { CSSDialog } from './dialogs/css-dialog/css-dialog.component';
import { FormsModule } from '@angular/forms';
import { CSSGlobalDialog } from './dialogs/css-global-dialog/css-global-dialog.component';
import { BindingDialog } from './dialogs/binding-dialog/binding-dialog.component';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { HTMLDialog } from './dialogs/html-dialog/html-dialog.component';

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
        FormsModule,
        MatButtonModule,
        MatSelectModule,

        MatFormFieldModule,
        BugFischSharedModule,
        BrowserModule,
        DragDropModule,
    ],
    declarations: [
        LayoutDesignerComponent,
        HTMLDialog,
        CSSDialog,
        CSSGlobalDialog,
        BindingDialog
    ],
    exports: [
        LayoutDesignerComponent,
        LayoutDesignerMenuModule,
        HTMLDialog,
        CSSDialog,
        CSSGlobalDialog,
        BindingDialog
    ]
})

export class LayoutDesignerModule { }

