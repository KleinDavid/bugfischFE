import { Component, Inject, OnInit, ViewEncapsulation, AfterViewChecked, ViewChild, OnDestroy } from '@angular/core';
import {  MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CssClass } from '../../layout-designer-objects/CssClass';

@Component({
    selector: 'css-dialog.component',
    templateUrl: 'css-dialog.component.html',
    styleUrls: ['css-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CSSDialog implements OnInit {

    cssClass: CssClass = new CssClass();
    cssClassOld: CssClass = new CssClass();

    constructor(
        public dialogRef: MatDialogRef<CSSDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit(): void {
        this.cssClassOld = JSON.parse(JSON.stringify(this.data.cssClass));
        this.cssClass = JSON.parse(JSON.stringify(this.data.cssClass));
        
        this.dialogRef.disableClose = true;
        this.dialogRef.backdropClick().subscribe(() => {
            this.close();
        });
    }

    save(): void {
        this.dialogRef.close({ data: { cssClass: this.cssClass } });
    }

    close(){
        this.dialogRef.close({ data: { cssClass: this.cssClassOld } });
    }
}
