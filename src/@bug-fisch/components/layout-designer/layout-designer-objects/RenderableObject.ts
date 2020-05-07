import { Subject, Observable } from "rxjs";
import { Position } from './Position';
import { TransformableObject } from './RenderableObjects/TransformableObject';
import { CssClass } from './CssClass';

export abstract class RenderableObject {
  
  position: Position;
  width: number;
  height: number; 
  borderWidth: number = 0;
  
  borderRadius: number = 0;
  borderColor: string = 'black';
  cursor: string = 'default';
  backgroundColor = 'none';
  borderStyle: string = 'solid';
  zIndex: number = 0;
  overflow: string = 'hidden';
  
  id: string = '';

  protected parent: TransformableObject;

  protected changedSubject: Subject<boolean> = new Subject<boolean>();
  protected childList: TransformableObject[] = [];

  protected htmlElementRef: HTMLElement;
  protected styleSheetPosition: HTMLStyleElement;
  protected styleSheet: HTMLStyleElement;

  cssClassList: CssClass[] = [];
  cssClassPosition: CssClass = new CssClass();

  constructor() {
    this.position = new Position();
    this.height = 0;
    this.width = 0;


  }

  create(): void {
    this.htmlElementRef = document.getElementById(this.id);
    this.id = !this.htmlElementRef ? this.id : this.id + '-1';
    this.htmlElementRef = document.createElement('div');
    this.htmlElementRef.id = this.id;
    document.getElementById(this.parent.id).appendChild(this.htmlElementRef);
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
    this.htmlElementRef.style.cursor = this.cursor;
    this.htmlElementRef.style.backgroundColor = this.backgroundColor;
    this.htmlElementRef.style.zIndex = this.zIndex + '';
    this.htmlElementRef.style.overflow = this.overflow;
  }

  delete(): void {
    let elem = document.getElementById(this.id);
    elem ? elem.parentNode.removeChild(elem) : '';
    this.styleSheet ? this.styleSheet.parentNode.removeChild(this.styleSheet) : '';
  }

  addChild(child: TransformableObject, absolute: boolean = false) {
    if (!absolute) {
      child.position.x -= this.position.x;
      child.position.y -= this.position.y;
    }
    this.childList.push(child);
  }

  removerChild(child: RenderableObject) {
    this.childList = this.childList.filter(c => c !== child);
  }

  getChildByPosition(position: Position): TransformableObject {
    position.x -= this.position.x;
    position.y -= this.position.y;
    this.childList = this.childList.filter(c => c.deleteState === false);
    let foundChilds = this.childList.filter(c => c.checkIfObjectIsThere(position.x, position.y));
    if (foundChilds.length > 0) {
      return foundChilds[foundChilds.length - 1]
    }
    return null;
  }


  getHTML(): string {
    return '';
  }

  checkIfObjectIsThere(x: number, y: number) {
    return (x > this.position.x && x < this.position.x + this.width + this.borderWidth * 2) &&
      (y > this.position.y && y < this.position.y + this.height + this.borderWidth * 2)
  }

  checkIfThisObjectIsInObject(ob: RenderableObject) {
    if (ob === this) {
      return false;
    }
    return this.checkIfObjectIsThere(ob.position.x, ob.position.y) &&
      this.checkIfObjectIsThere(ob.position.x + ob.width + ob.borderWidth * 2, ob.position.y + ob.height + ob.borderWidth * 2)
  }

  setParent(parent: TransformableObject): void {
    this.parent = parent;
  }

  getTopLeft(): Position {
    return this.position;
  }

  getBottomRight(): Position {
    return new Position(this.position.x + this.width + this.borderWidth * 2, this.position.y + this.height + this.borderWidth * 2);
  }

  getTopRight(): Position {
    return new Position(this.position.x + this.width + this.borderWidth * 2, this.position.y);
  }

  getBottomLeft(): Position {
    return new Position(this.position.x, this.position.y + this.height + this.borderWidth * 2);
  }

  getCenter(): Position {
    return new Position((this.position.x + this.width + this.borderWidth * 2) / 2, (this.position.y + this.height + this.borderWidth * 2) / 2);
  }

  getRelativeCenter(): Position {
    return new Position((this.width + this.borderWidth * 2) / 2, (this.height + this.borderWidth * 2) / 2);
  }

  getObservable(): Observable<boolean> {
    return this.changedSubject.asObservable();
  }
}