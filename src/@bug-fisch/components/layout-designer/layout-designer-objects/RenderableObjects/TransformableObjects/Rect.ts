import { TransformableObject } from "../TransformableObject";
import { EditField } from '../EditField';

export class Rect extends TransformableObject {
    icon: string = 'crop_landscape';
    type = 'Rect'
    backgroundColor = '#8a7f8d';
    typeName = 'Rechteck';

    editableProperties: string[] = ['position.x', 'position.y', 'width', 'height', 'zIndex', 'borderColor', 'borderWidth', 'borderStyle', 'borderRadius', 'backgroundColor'];
    borderStyleProperties: string[] = ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset']

    constructor(id: string, editField: EditField) {
        super(id, editField);
        this.editableProperties.concat([]);
    }

    getCopy(): Rect {
        let copyedObject: Rect = new Rect('', this.editField);
        for (let key in this) {
            if (key !== 'changedSubject') {
                copyedObject[key.toString()] = JSON.parse(JSON.stringify(this[key]));
            }
        }
        return copyedObject;
    }

    getHTML(): string {
        let div = document.createElement('div');
    
        div.style.position = 'absolute';
    
        div.style.height = this.height + 'px';
        div.style.width = this.width + 'px';
        div.style.top = this.position.y + 'px';
        div.style.left = this.position.x + 'px';
        div.style.zIndex = this.zIndex + '';
    
        div.style.borderRadius = this.borderRadius + 'px';
        div.style.cursor = this.cursor;
        div.style.backgroundColor = this.backgroundColor;
        div.style.border = this.borderWidth + 'px ' + this.borderStyle + ' ' + this.borderColor;
        div.id = this.id;
    
        if (this.selected) {
    
          this.createTransformRects();
          let resString = div.outerHTML;
    
          this.transformRects.forEach(rect => {
            resString += rect.getHTML();
          })
          return resString;
        }
        return div.outerHTML;
      }
}