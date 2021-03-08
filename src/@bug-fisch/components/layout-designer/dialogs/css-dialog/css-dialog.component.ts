import { Component, Inject, OnInit, ViewEncapsulation, AfterViewChecked, ViewChild, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CssClass } from '../../layout-designer-objects/CssClass';
import { DesignerBindingManager, Binding } from '../../managers/designerBindingManager';

@Component({
    selector: 'css-dialog.component',
    templateUrl: 'css-dialog.component.html',
    styleUrls: ['css-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CSSDialog implements OnInit {
    private bindingManager: DesignerBindingManager;

    startValueString = '';
    bindings: Binding[] = [];
    filteredBindings: Binding[] = [];
    valueString = '';
    cssClass: CssClass = new CssClass();
    cssClassOld: CssClass = new CssClass();

    constructor(
        public dialogRef: MatDialogRef<CSSDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.bindingManager = DesignerBindingManager.getInstance();
    }

    ngOnInit(): void {
        this.valueString = this.data.cssClass.getValueStringWithBinding();
        this.startValueString = this.valueString;
        this.bindingManager.startEditingBindings(this.valueString)
        this.bindings = this.bindingManager.findAndSetBindingsInString(this.valueString);
        this.filteredBindings = this.bindings;
        this.cssClassOld = this.data.cssClass.getCopy();
        this.cssClass = this.data.cssClass.getCopy();

        this.dialogRef.disableClose = true;
        this.dialogRef.backdropClick().subscribe(() => {
            this.close();
        });
    }

    save(): void {
        this.bindingManager.endEditingBindings(this.valueString);
        this.cssClass.setValuesByValueString(this.valueString);
        this.dialogRef.close({ data: { cssClass: this.cssClass } });
    }

    close() {
        this.bindingManager.endEditingBindings(this.startValueString);
        this.dialogRef.close({ data: { cssClass: this.cssClassOld } });
    }

    findBindingsInString(bindingString: string): void {
        this.bindings = this.bindingManager.findAndSetBindingsInString(bindingString);
        this.filteredBindings = this.bindings;
    }

    filterBindingsByName(value: string): void {
        this.filteredBindings = this.bindings.filter(b => b.name.includes(value));
    }

    setBindingValue(name: string, value: string) {
        this.bindingManager.setBindingValue(name, value);
    }
}
