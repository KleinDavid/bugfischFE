import { Subject, Observable } from "rxjs";
import { TransformRect } from './RenderableObjects/TransformRect';
import { Position } from './Position';
import { TransformableObject } from './RenderableObjects/TransformableObject';

export abstract class RenderableObject {
    width: number;
    height: number;
    borderRadius: number = 0;
    position: Position;
    borderWidth: number = 0;
    borderColor: string = 'black';
    cursor: string = 'default';
    backgroundColor = 'none';
    borderType: string = 'solid';
    zIndex: number = 0;
    overflow: string = 'hidden'
  
    cornerRectSize = 11;
    transformRects: TransformRect[] = [];
  
    protected outerObject: RenderableObject;
    protected changedSubject: Subject<boolean> = new Subject<boolean>();
    protected childList: TransformableObject[] = [];
  
    constructor() {
      this.position = new Position();
      this.height = 0;
      this.width = 0;
    }
  
    getHTML(): string {
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
      return div.outerHTML;
    }
  
    addChild(child: TransformableObject){
      child.position.x -= this.position.x;
      child.position.y -= this.position.y;
      this.childList.push(child);
    }

    removerChild(child: RenderableObject) {
      this.childList = this.childList.filter(c => c !== child);
    }

    getChildByPosition(position: Position): TransformableObject{
      position.x -= this.position.x;
      position.y -= this.position.y;

      let foundChilds = this.childList.filter(c => c.checkIfObjectIsThere(position.x, position.y));
      if (foundChilds.length > 0){
        return foundChilds[foundChilds.length -1]
      }
      return null;
    }

    setOuterObject(ob: RenderableObject): void {
      this.outerObject = ob
    }
  
    checkIfObjectIsThere(x: number, y: number) {
      return (x > this.position.x && x < this.position.x + this.width) &&
        (y > this.position.y && y < this.position.y + this.height)
    }
  
    checkIfThisObjectIsInObject(ob: RenderableObject) {
      if (ob === this) {
        return false;
      }
      return this.checkIfObjectIsThere(ob.position.x, ob.position.y) &&
        this.checkIfObjectIsThere(ob.position.x + ob.width + ob.borderWidth * 2, ob.position.y + ob.height + ob.borderWidth * 2)
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