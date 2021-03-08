import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CssClass } from '../../layout-designer-objects/CssClass';
import { DesignerCssClassManager } from '../../managers/designerCssClassManager';
import { DesignerBindingManager, Binding } from '../../managers/designerBindingManager';

@Component({
    selector: 'css-global-dialog.component',
    templateUrl: 'css-global-dialog.component.html',
    styleUrls: ['css-global-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CSSGlobalDialog implements OnInit {
    private bindingManager: DesignerBindingManager = DesignerBindingManager.getInstance();
    globalClasses: CssClass[] = [];
    globalClassesFiltered: CssClass[] = [];

    cssClass: CssClass = new CssClass();
    cssClassOld: CssClass = new CssClass();
    selectedClass = new CssClass();
    bindings: Binding[] = [];
    filteredBindings: Binding[] = [];

    valueString: string = '';

    private classManager = DesignerCssClassManager.getInstance();

    constructor(
        public dialogRef: MatDialogRef<CSSGlobalDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) {

        this.dialogRef.disableClose = true;
        this.dialogRef.backdropClick().subscribe(() => {
            this.close();
        });
    }

    ngOnInit(): void {
        this.globalClasses = this.classManager.classes;
        this.globalClassesFiltered = this.globalClasses;

        if(this.globalClasses.length > 0){
            this.onClassClick(this.globalClasses[0]);
        }else {
            this.addClass();
        }
    }

    onClassClick(cssClass: CssClass): void {
        this.selectedClass = cssClass;
        this.valueString = this.selectedClass.getValueStringWithBinding();
        this.bindingManager.startEditingBindings(this.valueString);
        this.bindings = this.bindingManager.findAndSetBindingsInString(this.valueString);
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
                
            }
            this.bindingManager.endEditingBindings(this.valueString);
            this.selectedClass.setValuesByValueString(this.valueString);
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
        this.bindingManager.startEditingBindings('');
        this.bindings = [];
        this.valueString = '';
        this.selectedClass = null;
        this.cssClass = new CssClass();
    }

    findBindingsInString(bindingString: string): void {
        this.bindings = this.bindingManager.findAndSetBindingsInString(bindingString);
    }

    filterBindingsByName(value: string): void {
        this.filteredBindings = this.bindings.filter(b => b.name === value);
    }

    setBindingValue(name: string, value: string) {
        this.bindingManager.setBindingValue(name, value);
    }
}
