import { TransformableObject } from "../TransformableObject";
import { Position } from '../../Position';

export class Rect extends TransformableObject {
  icon: string = 'crop_landscape';
  type = 'Rect'
  backgroundColor = '#8a7f8d';
  typeName = 'Rechteck';

  editableProperties: string[] = ['position.x', 'position.y', 'width', 'height', 'zIndex', 'borderColor', 'borderWidth', 'borderStyle', 'borderRadius', 'backgroundColor'];
  borderStyleProperties: string[] = ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset']
  halfStyleProperties: string[] = ['position.x', 'position.y', 'width', 'height'];

  constructor(id: string) {
    super(id);
    this.editableProperties.concat([]);
  }

  create(): void {
    this.styleSheet = document.createElement('style');
    this.styleSheet.type = 'text/css';
    this.styleSheet.innerHTML = this.getCss();
    let documentHead = document.getElementsByTagName('head')[0];
    documentHead.insertBefore(this.styleSheet, documentHead.firstChild);

    this.htmlElementRef = document.createElement('div');
    this.htmlElementRef.id = this.id;
    this.cssClassList.forEach(c => {
      this.htmlElementRef.classList.add(c.name);
    });
    
    this.htmlElementRef.classList.add(this.type + '-' + this.id);
    document.getElementById(this.parent.id).appendChild(this.htmlElementRef);
    this.render();
  }

  render(): void {
    /*this.htmlElementRef.style.position = 'absolute';
    this.htmlElementRef.draggable = false;

    this.htmlElementRef.style.height = this.height + 'px';
    this.htmlElementRef.style.width = this.width + 'px';
    this.htmlElementRef.style.top = this.position.y + 'px';
    this.htmlElementRef.style.left = this.position.x + 'px';
    this.htmlElementRef.style.zIndex = this.zIndex + '';

    this.htmlElementRef.style.borderRadius = this.borderRadius + 'px';
    this.htmlElementRef.style.cursor = this.cursor;
    this.htmlElementRef.style.backgroundColor = this.backgroundColor;
    this.htmlElementRef.style.border = this.borderWidth + 'px ' + this.borderStyle + ' ' + this.borderColor;*/
    if (!this.styleSheet) { return; }
    this.styleSheet.innerHTML = this.getCss();
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

  getHTML(): string {
    let div = document.getElementById(this.id)
    if (!div) {
      div = document.createElement('div');
      div.id = this.id;
      document.getElementById(this.parent.id).appendChild(div);
    }

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

    /*if (this.selected) {

      this.createTransformRects();
      let resString = div.outerHTML;

      this.transformRects.forEach(rect => {
        resString += rect.getHTML();
      })
      return '';
    }
    return '';*/
    return ''
  }

  transform(position: Position): void {
    super.transform(position);
    this.render();
  }

  getCss(): string {
    let res = '.' + this.type + '-' + this.id + '{\n';
    res += this.getInnerCss();
    res += '}\n\n';
    return res;
  }

  private getInnerCss(): string {
    let res = ''
    res += 'position: absolute;\n';
    res += 'height: ' + Math.round(this.height) + 'px;\n';
    res += 'width: ' + Math.round(this.width) + 'px\n;';
    res += 'top: ' + Math.round(this.position.y) + 'px;\n';
    res += 'left: ' + Math.round(this.position.x) + 'px;\n';
    res += 'z-index: ' + this.zIndex + ';\n';

    res += 'border-radius: ' + this.borderRadius + 'px;\n';
    res += 'cursor: ' + this.cursor + ';\n';
    res += 'background-color : ' + this.backgroundColor + ';\n';
    res += 'border : ' + this.borderWidth + 'px ' + this.borderStyle + ' ' + this.borderColor + ';\n'
    return res;
  }
}