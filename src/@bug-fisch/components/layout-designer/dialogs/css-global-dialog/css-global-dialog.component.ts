import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CssClass } from '../../layout-designer-objects/CssClass';

@Component({
    selector: 'css-global-dialog.component',
    templateUrl: 'css-global-dialog.component.html',
    styleUrls: ['css-global-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CSSGlobalDialog implements OnInit {

    globalClasses: CssClass[] = [];
    globalClassesFiltered: CssClass[] = [];

    cssClass: CssClass = new CssClass();
    cssClassOld: CssClass = new CssClass();
    selectedClass = new CssClass();

    constructor(
        public dialogRef: MatDialogRef<CSSGlobalDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) {

        this.dialogRef.disableClose = true;
        this.dialogRef.backdropClick().subscribe(() => {
            this.close();
        });
    }

    ngOnInit(): void {
        this.globalClasses = this.data.globalClasses;
        /*let i = new CssClass();
        i.name = 'uuusdjdfj';
        let u = new CssClass();
        u.name = 'uuujdfj';
        let o = new CssClass();
        o.name = 'NorderBDi';
        this.globalClasses = [i, u, o];*/
        this.globalClassesFiltered = this.globalClasses;

        if(this.globalClasses.length > 0){
            this.onClassClick(this.globalClasses[0]);
        }else {
            this.addClass();
        }
    }

    onClassClick(cssClass: CssClass): void {
        this.selectedClass = cssClass;
        this.cssClassOld = JSON.parse(JSON.stringify(cssClass));
        this.cssClass = JSON.parse(JSON.stringify(cssClass));
    }

    save(): void {
        if (this.cssClass.name !== '') {
            if (!this.selectedClass) {
                this.selectedClass = this.cssClass;
                this.globalClasses.push(this.selectedClass);
                this.cssClass = JSON.parse(JSON.stringify(this.cssClass));
            } else {
                this.selectedClass.name = this.cssClass.name;
                this.selectedClass.valueString = this.cssClass.valueString;
            }
            this.selectedClass.create();
        }
    }

    close() {
        this.dialogRef.close();
    }

    filterClasses(filterValue: string): void {
        this.globalClassesFiltered = this.globalClasses.filter(c => c.name.toLowerCase().includes(filterValue.toLowerCase()))
    }

    isClassSelected(cssClass: CssClass): boolean {
        return cssClass === this.selectedClass;
    }

    addClass(): void {
        this.selectedClass = null;
        this.cssClass = new CssClass();
    }
}
