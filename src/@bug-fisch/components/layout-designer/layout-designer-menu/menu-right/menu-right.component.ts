import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { LayoutDesignerlCreationMode, LayoutDesignerImagePosition } from '../../layout-designer-objects/Enums'; import { TransformableObject } from '../../layout-designer-objects/RenderableObjects/TransformableObject';
import { Transformation } from '../../layout-designer-objects/Transformation';
;


@Component({
  selector: 'atled-layout-designer-menu-right',
  templateUrl: './menu-right.component.html',
  styleUrls: ['./menu-right.component.scss']
})
export class LayoutDesignerMenuRightComponent implements OnInit {

  @Input() currentCreationMode: LayoutDesignerlCreationMode = LayoutDesignerlCreationMode.None;
  @Input() selectedObject: TransformableObject;

  @Output() change: EventEmitter<any> = new EventEmitter();

  colors: any = {};
  creationModes = LayoutDesignerlCreationMode;
  imagePositions = LayoutDesignerImagePosition;
  selectDataLists = {}

  constructor() {
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
}
