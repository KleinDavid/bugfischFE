import { Component, Inject, OnInit, ViewEncapsulation, AfterViewChecked, ViewChild, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CssClass } from '../../layout-designer-objects/CssClass';
import { DesignerBindingManager, Binding } from '../../managers/designerBindingManager';
import { DesignerCssClassManager } from '../../managers/designerCssClassManager';
import { DesignerFileManager } from '../../managers/designerFileManager';

@Component({
    selector: 'binding-dialog.component',
    templateUrl: 'binding-dialog.component.html',
    styleUrls: ['binding-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BindingDialog implements OnInit {
    private bindingManager: DesignerBindingManager;
    private classManager: DesignerCssClassManager = DesignerCssClassManager.getInstance();
    fileManager: DesignerFileManager = DesignerFileManager.getInstance();
    bindings: Binding[] = [];
    filteredBindings: Binding[] = [];
    selectedBinding: Binding;
    filterValue = '';

    constructor(
        public dialogRef: MatDialogRef<BindingDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.bindingManager = DesignerBindingManager.getInstance();
    }

    ngOnInit(): void {
        this.bindings = this.bindingManager.bindings;
        this.filteredBindings = this.bindings;
        if (this.data.filterValue) {
            this.filterBindings(this.data.filterValue);
            this.selectedBinding = this.filterBindings.length > 0 ? this.filterBindings[0] : null;
        }
        this.dialogRef.disableClose = true;
        this.dialogRef.backdropClick().subscribe(() => {
            this.close();
        });
    }

    filterBindings(value: string): void {
        this.filterValue = value;
        this.filteredBindings = this.bindings.filter(b => b.name.includes(value));
    }

    onSelectBinding(binding: Binding): void {
        this.selectedBinding = binding
    }

    isBindingSelected(binding: Binding): boolean {
        return this.selectedBinding === binding;
    }

    setBindingValue(name: string, value: string) {
        this.bindingManager.setBindingValue(name, value);
    }

    close() {
        this.classManager.updateClasses();
        this.dialogRef.close();
    }

    uploadImageFile(): void {
        this.fileManager.uploadFile().subscribe(v => {
            this.selectedBinding.value = v;
        })
    }
}
