import { TransformableObject } from "./TransformableObject";
import { ZoomableObject } from '../ZoomableObject';
import { Position } from '../Position';

export class IdCard extends TransformableObject implements ZoomableObject {
  borderWidth = 1;
  borderRadius = 20;
  typeName = 'Arbeitsbereich';
  overflow = 'visible'

  editableProperties = ['backgroundColor'];

  getHTML(): string {
    this.childList = this.childList.filter(c => c.deleteState === false);

    let div = document.createElement('div');
    div.style.position = 'absolute';

    div.style.height = this.height + 'px';
    div.style.width = this.width + 'px';
    div.style.top = this.position.y + 'px';
    div.style.left = this.position.x + 'px';
    div.style.border = this.borderWidth + 'px ' + this.borderType + ' ' + this.borderColor;
    div.style.borderRadius = this.borderRadius + 'px';
    div.style.cursor = this.cursor;
    div.style.backgroundColor = this.backgroundColor;
    div.style.zIndex = this.zIndex + '';

    div.style.overflow = this.overflow;
    for (let child of this.childList) {
      div.innerHTML += child.getHTML();
    }
    // this.setZoom(1.5,div);
    return div.outerHTML;
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
    let result = this.getHTML();
    if (selectedObject) { selectedObject.select() }
    this.overflow = oldOverflow;
    this.position.x = x;
    this.position.y = y;
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
}