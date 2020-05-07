import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { LayoutDesignerlCreationMode, LayoutDesignerImagePosition } from '../../layout-designer-objects/Enums'; import { TransformableObject } from '../../layout-designer-objects/RenderableObjects/TransformableObject';
import { Transformation } from '../../layout-designer-objects/Transformation';
import { CssClass } from '../../layout-designer-objects/CssClass';
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

  colors: any = {};
  creationModes = LayoutDesignerlCreationMode;
  imagePositions = LayoutDesignerImagePosition;
  selectDataLists = {};
  selectedClass = new CssClass();

  constructor(private cssDialog: MatDialog) {
    let testClass = new CssClass();
    testClass.name = 'borderLeft';
    testClass.valueString = 'border-left: 1px solid black';
    this.globalCssClasses.push(testClass);
    testClass.create();
  }

  ngOnInit(): void {
    this.colors['backgroundColor'] = '';
    this.colors['borderColor'] = '';
  }

  clickMenu(btnNumber: number) {
  }

  checkEditMode(btnNumber: number) {
    return btnNumber === this.currentCreationMode;
  }

  setInput(): void {

  }

  getEditableValuesOfSelectedObject(): any {
    if (this.selectedObject) {
      return this.selectedObject.editableProperties;
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
    if (this.getValueType(valueName) == 'number') {
      return (returnValue | 0) as number;
    }
    return returnValue;
  }

  setValue(valueName: string, value: any) {
    let transformation = new Transformation;
    transformation.propertyName = valueName;
    transformation.valueBefore = this.getValue(valueName);

    let prop = this.selectedObject;
    let list = valueName.split('.');

    for (let i = 0; i < list.length - 1; i++) {
      prop = prop[list[i]];
    }
    let type = this.getValueType(valueName);
    if (type === 'number') {
      if (this.getMaxValue(valueName) < parseInt(value)) { value = this.getMaxValue(valueName); }
      if (this.getMinValue(valueName) > parseInt(value)) { value = this.getMinValue(valueName); }
      prop[list[list.length - 1]] = parseInt(value) as number;
    } else if (type === 'string') {
      prop[list[list.length - 1]] = value + '' as string;
    } else {
      prop[list[list.length - 1]] = value;
    }
    transformation.valueAfter = this.getValue(valueName);
    this.selectedObject.getPositionAndSizeChanceSubject().next(transformation);
    this.change.emit();
  }

  getValueType(valueName: string): string {
    let returnValue = this.selectedObject;
    valueName.split('.').forEach((name: string) => {
      returnValue = returnValue[name];
    });
    if (valueName + 'Properties' in this.selectedObject) {
      return 'list';
    }

    if (valueName + 'PropertiesNotFixed' in this.selectedObject) {
      return 'listAndWrite';
    }
    return typeof returnValue;
  }

  checkEnterPress(keyCode: string, valueName: string, value: any): void {
    if (keyCode === 'Enter') {
      this.setValue(valueName, value);
    }
  }

  getColorPickerWidth(): string {
    if (document.getElementsByClassName('$valueInput').length === 0) {
      return '0';
    }
    return (document.getElementsByClassName('$valueInput')[0].getBoundingClientRect().width - 1) + '';
  }

  getPropertyByValueName(valueName: string): any {
    let prop = this.selectedObject;
    let list = valueName.split('.');

    for (let i = 0; i < list.length - 1; i++) {
      prop = prop[list[i]];
    }
    return prop[list[list.length - 1]];
  }

  getColorByName(valueName: string): string {
    if (valueName in this.colors) {
      return this.colors[valueName];
    } else {
      this.colors[valueName] = this.getValue(valueName);
    }
    return this.colors[valueName];
  }

  colorChanged(valueName: string, event: string): void {
    if(valueName in this.colors){
      if(this.colors[valueName] !== event){
        this.setValue(valueName, event);
      }
    }
    this.colors[valueName] = event;
  }

  getSelectListByValueName(valueName: string): string[] {
    return this.selectedObject[valueName + 'Properties'];
  }

  getMaxValue(valueName: string): number {
    if (valueName === 'zIndex') { return 999; }
    return Number.MAX_SAFE_INTEGER;
  }

  getMinValue(valueName: string): number {
    if (['position.x', 'position.y'].includes(valueName)) { return Number.MIN_SAFE_INTEGER; }
    return 0;
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
      cssClass.valueString = cssClassNew.valueString;
      cssClass.create();
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
      cssClass.valueString = cssClassNew.valueString;
      if (cssClassNew.name !== '') {
        this.selectedObject.addClass(cssClass);
        this.globalCssClasses.push(cssClass);
        cssClass.create();
      }
    });
  }

  getHalfPropertyClass(valueName: string): string {
    if (!this.selectedObject.halfStyleProperties.includes(valueName)) {
      return '';
    }
    return this.selectedObject.halfStyleProperties.indexOf(valueName) % 2 === 0 ? 'padding-right' : 'padding-left';
  }
}
