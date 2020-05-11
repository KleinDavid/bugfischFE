import { TransformableObject } from "../TransformableObject";
import { Position } from '../../Position';
import { CssClass } from '../../CssClass';

export class Rect extends TransformableObject {
  icon: string = 'crop_landscape';
  type = 'Rect'
  typeName = 'Rechteck';

  cssClassStyleProperties = [
    { valueName: 'position', value: 'absolute' },
    { valueName: 'border-color', value: 'black' },
    { valueName: 'border-style', value: 'solid' },
    { valueName: 'border-radius', value: '0' },
    { valueName: 'background-color', value: '#8a7f8d' },
    { valueName: 'cursor', value: 'move' }
  ];

  constructor(id: string) {
    super(id);
  }

  create(): void {

    this.htmlElementRef = document.createElement('div');
    this.htmlElementRef.id = this.type + '-' + this.id;
    this.cssClassList.forEach(c => {
      this.htmlElementRef.classList.add(c.name);
    });

    let htmlRefList = [this.htmlElementRef];
    let id = this.type + '-' + this.id + '-position';
    this.cssClassPosition = this.createCssElement(id, [], htmlRefList);

    htmlRefList = [this.htmlElementRef];
    id = this.type + '-' + this.id + '-style';
    this.createCssElement(id, this.cssClassStyleProperties, htmlRefList);

    document.getElementById(this.parent.id).appendChild(this.htmlElementRef);
    this.render();
  }

  getCopy(): Rect {
    let copyedObject: Rect = new Rect('');
    for (let key in this) {
      if (key !== 'changedSubject' && key !== 'transformRects' && key !== 'parent') {
        copyedObject[key.toString()] = JSON.parse(JSON.stringify(this[key]));
      }
    }
    return copyedObject;
  }

  transform(position: Position): void {
    super.transform(position);
    this.render();
  }
}