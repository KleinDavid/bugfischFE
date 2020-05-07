import { TransformableObject } from "./TransformableObject";
import { ZoomableObject } from '../ZoomableObject';
import { Position } from '../Position';

export class IdCard extends TransformableObject implements ZoomableObject {
  type: string = 'idCard';
  icon: string = 'web';

  borderWidth = 1;
  borderRadius = 20;
  typeName = 'Arbeitsbereich';
  overflow = 'visible';
  curser = 'default';

  editableProperties = ['backgroundColor'];

  constructor(id: string) {
    super(id);
    this.positionAndSizeChanceSubject.subscribe(() => {
      this.render();
    })
  }

  create(): void {
    this.htmlElementRef = document.createElement('div');
    this.htmlElementRef.id = this.id;
    document.getElementById('cardBoundary').appendChild(this.htmlElementRef);
    this.render();
  }

  render(): void {
    this.htmlElementRef.style.position = 'absolute';
    this.htmlElementRef.style.height = this.height + 'px';
    this.htmlElementRef.style.width = this.width + 'px';
    this.htmlElementRef.style.top = this.position.y + 'px';
    this.htmlElementRef.style.left = this.position.x + 'px';
    this.htmlElementRef.style.border = this.borderWidth + 'px ' + this.borderStyle + ' ' + this.borderColor;
    this.htmlElementRef.style.borderRadius = this.borderRadius + 'px';
    this.htmlElementRef.style.backgroundColor = this.backgroundColor;
    this.htmlElementRef.style.zIndex = 10 + '';
    this.htmlElementRef.style.overflow = this.overflow;
  }

  getHTML(): string {
    let div = document.getElementById(this.id);
    if (!div) {
      div = document.createElement('div');
      div.id = this.id;
      document.getElementById('cardBoundary').appendChild(div);
    }
    this.childList = this.childList.filter(c => c.deleteState === false);

    div.style.position = 'absolute';
    div.style.height = this.height + 'px';
    div.style.width = this.width + 'px';
    div.style.top = this.position.y + 'px';
    div.style.left = this.position.x + 'px';
    div.style.border = this.borderWidth + 'px ' + this.borderStyle + ' ' + this.borderColor;
    div.style.borderRadius = this.borderRadius + 'px';
    div.style.cursor = this.cursor;
    div.style.backgroundColor = this.backgroundColor;
    div.style.zIndex = this.zIndex + '';

    div.style.overflow = this.overflow;
    for (let child of this.childList) {
      if (child.selected) {
        div.innerHTML += child.getHTML();
      }
    }
    // this.setZoom(1.5,div);
    return '';
  }

  setZoom(zoom, el) {

    let transformOrigin = [0, 0];
    el = el;
    var p = ["webkit", "moz", "ms", "o"],
      s = "scale(" + zoom + ")",
      oString = (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%";

    for (var i = 0; i < p.length; i++) {
      el.style[p[i] + "Transform"] = s;
      el.style[p[i] + "TransformOrigin"] = oString;
    }

    el.style["transform"] = s;
    el.style["transformOrigin"] = oString;

  }

  getFinalHTML() {
    let selectedObject = this.childList.find(c => c.selected === true);
    let x = this.position.x;
    let y = this.position.y;
    this.position.x = 0;
    this.position.y = 0;
    this.childList.forEach(c => {
      c.unselect();
    })
    let oldOverflow = this.overflow;
    this.overflow = 'hidden';
    this.render();
  
    let result = this.htmlElementRef.outerHTML;
    if (selectedObject) { selectedObject.select() }
    this.overflow = oldOverflow;
    this.position.x = x;
    this.position.y = y;
    this.render();
    return result;
  }

  zoom(factor: number, center: Position = this.getRelativeCenter()): void {
    let transXFactor = center.x / (this.width + this.borderWidth * 2);
    let transYFactor = center.y / (this.height + this.borderWidth * 2);

    let widthBefore = this.width;
    let centerBefore = center;

    this.position.x -= factor * transXFactor;
    this.width += factor;
    let factorY = factor / widthBefore * this.height;
    this.position.y -= factorY * transYFactor;
    this.height += factorY;
    this.childList.forEach(c => {
      let childFactor = (factor / this.width) * c.width;
      c.zoom(childFactor, centerBefore, factor * transXFactor, factorY * transYFactor);
    });
  }

  getCopy(): TransformableObject {
    return null;
  }

  getHtml(): string {
    return this.htmlElementRef.outerHTML;
  }
}