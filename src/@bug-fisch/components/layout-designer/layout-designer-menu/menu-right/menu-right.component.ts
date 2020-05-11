import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { LayoutDesignerlCreationMode, LayoutDesignerImagePosition } from '../../layout-designer-objects/Enums'; import { TransformableObject } from '../../layout-designer-objects/RenderableObjects/TransformableObject';
import { Transformation } from '../../layout-designer-objects/Transformation';
import { CssClass, CssClassValue, CssValueType } from '../../layout-designer-objects/CssClass';
import { MatDialog } from '@angular/material/dialog';
import { CSSDialog } from '../../dialogs/css-dialog/css-dialog.component';
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
  @Input() globalCssClasses: CssClass[] = [];

  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() disableLayoutDesinger: EventEmitter<boolean> = new EventEmitter();

  CssValueType = CssValueType;

  colors: any = {};
  creationModes = LayoutDesignerlCreationMode;
  imagePositions = LayoutDesignerImagePosition;
  selectDataLists = {};
  selectedClass = new CssClass();

  constructor(private cssDialog: MatDialog) {
    let testClass = new CssClass();
    testClass.name = 'borderLeft';
    // testClass.valueString = 'border-left: 1px solid black';
    this.globalCssClasses.push(testClass);
    testClass.create();
  }

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
    const dialogRef = this.cssDialog.open(CSSDialog, {
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
    });
  }

  addNewClass() {
    let cssClass = new CssClass();
    this.disableAll = true;
    this.disableLayoutDesinger.emit(true);
    const dialogRef = this.cssDialog.open(CSSDialog, {
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
        this.globalCssClasses.push(cssClass);
        cssClass.create();
      }
    });
  }

  getHalfPropertyClass(valueName: string): string {
    let halfProps = this.getEditableValuesOfSelectedObject().filter(v => v.smallEditField);
    let prop = halfProps.find(v => v.valueName === valueName)
    if (!prop) {
      return '';
    }
    return halfProps.indexOf(prop) % 2 === 0 ? 'padding-right' : 'padding-left';
  }

  getActiveClasses(): CssClass[]{
    return this.selectedObject.cssClassList.filter(c => c.active);
  }
}
