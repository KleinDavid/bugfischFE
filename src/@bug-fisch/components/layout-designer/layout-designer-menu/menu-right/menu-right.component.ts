import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { LayoutDesignerlCreationMode, LayoutDesignerImagePosition } from '../../layout-designer-objects/Enums'; import { TransformableObject } from '../../layout-designer-objects/RenderableObjects/TransformableObject';
import { CssClass, CssClassValue, CssValueType } from '../../layout-designer-objects/CssClass';
import { MatDialog } from '@angular/material/dialog';
import { CSSDialog } from '../../dialogs/css-dialog/css-dialog.component';
import { DesignerFileManager } from '../../managers/designerFileManager';
import { EditableImage } from '../../layout-designer-objects/RenderableObjects/TransformableObjects/EditableImage';
import { Binding, DesignerBindingManager } from '../../managers/designerBindingManager';
import { BindingDialog } from '../../dialogs/binding-dialog/binding-dialog.component';
import { DesignerCssClassManager } from '../../managers/designerCssClassManager';
;


@Component({
  selector: 'atled-layout-designer-menu-right',
  templateUrl: './menu-right.component.html',
  styleUrls: ['./menu-right.component.scss']
})
export class LayoutDesignerMenuRightComponent implements OnInit {

  @Input() currentCreationMode: LayoutDesignerlCreationMode = LayoutDesignerlCreationMode.None;
  @Input() selectedObject: TransformableObject;
  @Input() cssMode: boolean = false;
  @Input() disableAll: boolean = false;

  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() disableLayoutDesinger: EventEmitter<boolean> = new EventEmitter();

  private bindingManager = DesignerBindingManager.getInstance();
  private cssClassManager: DesignerCssClassManager = DesignerCssClassManager.getInstance();

  CssValueType = CssValueType;
  fileManager = DesignerFileManager.getInstance();
  classManager = DesignerCssClassManager.getInstance();

  colors: any = {};
  creationModes = LayoutDesignerlCreationMode;
  imagePositions = LayoutDesignerImagePosition;
  selectDataLists = {};
  selectedClass = new CssClass();

  bindings: Binding[] = [];
  filteredBindings: Binding[] = [];
  imageSrc = '';

  constructor(private dialogRef: MatDialog) {}

  ngOnInit(): void {
    this.colors['backgroundColor'] = '';
    this.colors['borderColor'] = '';
  }

  checkEditMode(btnNumber: number) {
    return btnNumber === this.currentCreationMode;
  }

  getEditableValuesOfSelectedObject(): CssClassValue[] {
    if (this.selectedObject) {
      let list = [];
      this.selectedObject.cssClassList.filter(c => c.menuRightEditable).forEach(cl => {
        list = list.concat(cl.valueList);
      });
      return list.filter(v => v.editable);
    } else {
      return [];
    }
  }

  getValue(valueName: string): any {
    let returnValue: any = this.selectedObject;
    for (let name of valueName.split('.')) {
      if (returnValue) {
        returnValue = returnValue[name];
      } else {
        return '';
      }
    }
    return returnValue;
  }

  setValue(valueName: string, value: any) {
    this.selectedObject.setCssValue(valueName, value);
  }

  checkEnterPress(keyCode: string, valueName: string, value: any): void {
    if (keyCode === 'Enter') {
      this.setValue(valueName, value);
    }
  }

  colorChanged(valueName: string, event: string): void {
    if (valueName in this.colors) {
      if (this.colors[valueName] !== event) {
        this.setValue(valueName, event);
      }
    }
    this.colors[valueName] = event;
  }

  addCssClass(value: CssClass) {
    if (!this.selectedObject.cssClassList.includes(value)) {
      console.log(value);
      this.selectedObject.addClass(value);
    }
    this.selectedClass = null;
  }

  removeCssClass(cssClass: CssClass): void {
    this.selectedObject.removeCssClass(cssClass);
  }

  editCssClass(cssClass: CssClass) {
    this.disableAll = true;
    this.disableLayoutDesinger.emit(true);
    const dialogRef = this.dialogRef.open(CSSDialog, {
      panelClass: 'dialog',
      autoFocus: false,
      data: { cssClass: cssClass }
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      this.disableLayoutDesinger.emit(false);
      let cssClassNew = res.data.cssClass as CssClass;
      cssClass.name = cssClassNew.name;
      cssClass.valueList = cssClassNew.valueList;
      cssClass.update();
      this.selectedObject.updateClasses();
      this.cssClassManager.updateClasses();
    });
  }

  addNewClass() {
    let cssClass = new CssClass();
    this.disableAll = true;
    this.disableLayoutDesinger.emit(true);
    const dialogRef = this.dialogRef.open(CSSDialog, {
      panelClass: 'dialog',
      autoFocus: false,
      data: { cssClass: cssClass }
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      this.disableLayoutDesinger.emit(false);
      let cssClassNew = res.data.cssClass as CssClass;
      cssClass.name = cssClassNew.name;
      cssClass.valueList = cssClassNew.valueList;
      if (cssClassNew.name !== '') {
        this.selectedObject.addClass(cssClass);
        this.classManager.addClass(cssClass);
        cssClass.create();
      }
      this.cssClassManager.updateClasses();
    });
  }

  getImagePath(): string {
    return (this.selectedObject as EditableImage).imagePath;
  }

  uploadImageFile(): void {
    this.bindingManager.startEditingBindings(this.getImagePath());
    this.bindingManager.endEditingBindings('');
    (this.selectedObject as EditableImage).uploadNewImageFile();
  }

  setImagePath(path: string): void {
    (this.selectedObject as EditableImage).setImagePath(path);
    this.bindingManager.endEditingBindings(path);
  }

  getHalfPropertyClass(valueName: string): string {
    let halfProps = this.getEditableValuesOfSelectedObject().filter(v => v.smallEditField);
    let prop = halfProps.find(v => v.valueName === valueName)
    if (!prop) {
      return '';
    }
    return halfProps.indexOf(prop) % 2 === 0 ? 'padding-right' : 'padding-left';
  }

  checkEnterPressImageSrc(keyCode: string, value: string): void {
    if (keyCode === 'Enter') {
      this.setImagePath(value);
    }
  }

  getActiveClasses(): CssClass[] {
    return this.selectedObject.cssClassList.filter(c => c.active && c.menuRightEditable);
  }

  findBindingsInString(bindingString: string): void {
    this.bindings = this.bindingManager.findAndSetBindingsInString(bindingString, true);
  }

  filterBindingsByName(value: string): void {
    this.filteredBindings = this.bindings.filter(b => b.name === value);
  }

  setBindingValue(name: string, value: string) {
    this.bindingManager.setBindingValue(name, value);
  }

  onFocusSrcInput(value: string): void {
    this.bindingManager.startEditingBindings(value);
  }

  openBindingDialog(binding: Binding) {
    this.disableAll = true;
    this.disableLayoutDesinger.emit(true);
    const dialogRef = this.dialogRef.open(BindingDialog, {
      panelClass: 'binding-dialog',
      autoFocus: false,
      data: { filterValue: binding.name }
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      
      this.cssClassManager.updateClasses();
      this.setImagePath(this.getImagePath());
      this.disableLayoutDesinger.emit(false);
    });
  }
}
