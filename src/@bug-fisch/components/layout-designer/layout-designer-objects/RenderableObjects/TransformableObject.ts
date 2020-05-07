import { RenderableObject } from '../RenderableObject';
import { LayoutDesignerlEditMode } from '../Enums';
import { TransformRect } from './TransformRect';
import { Position } from '../Position';
import { Subject } from 'rxjs';
import { Transformation } from '../Transformation';
import { CssClass } from '../CssClass';

export abstract class TransformableObject extends RenderableObject {

  selected: boolean = false;
  deleteState: boolean = false;
  protected positionAndSizeChanceSubject: Subject<Transformation> = new Subject<Transformation>();

  id: string;
  editMode: LayoutDesignerlEditMode = LayoutDesignerlEditMode.None;
  editableProperties: string[] = ['position.x', 'position.y', 'width', 'height', 'borderColor', 'borderWidth', 'borderStyle', 'borderRadius', 'backgroundColor'];
  chanceableProperties: string[] = []
  halfStyleProperties: string[] = [];

  abstract type: string;
  abstract typeName: string;
  abstract icon: string;
  
  relativeWidthToParent: number;
  relativeHeightToParent: number;
  relativePositionToParent: Position;

  transformRects: TransformRect[] = [];
  cornerRectSize = 11;

  constructor(id: string) {
    super()
    this.id = id;
    this.cursor = 'pointer';
  }

  create(): void {

  }

  render(): void {

  }

  checkIfObjectIsThere(x: number, y: number): boolean {
    if (this.selected) {
      for (let i = 0; i < 8; i++) {
        if (this.transformRects[i].checkIfObjectIsThere(x, y)) {
          this.editMode = i + 2;
          return true;
        }
      }
    }
    if (super.checkIfObjectIsThere(x, y)) {
      this.editMode = LayoutDesignerlEditMode.Move;
      return true;
    }
    return false;
  }

  editEnd(): void {
    if (this.width === 0 && this.height === 0) {
      this.delete();
    }
    this.editMode = LayoutDesignerlEditMode.Move;
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

  select(): void {
    this.cursor = 'move';
    this.createTransformRects();
    this.selected = true;
  }

  unselect(): void {
    this.cursor = 'pointer';
    this.editMode = LayoutDesignerlEditMode.None;
    this.transformRects.forEach(r => r.delete());
    this.transformRects = [];
    this.selected = false;
  }

  delete(): void {
    this.deleteState = true;
    this.transformRects.forEach(t => t.delete());
    super.delete();
  }

  public moveByDifference(position: Position) {
    this.position.x += position.x;
    this.position.y += position.y;
  }

  update(): void {
    this.createTransformRects();
  }

  setParent(ob: TransformableObject): void {
    this.parent = ob;
  }

  transform(position: Position): void {
    if (this.editMode === LayoutDesignerlEditMode.Move) {
      this.moveByDifference(position);
    } else {
      this.resize(position);
      this.changeResizeDirection();
    }
    this.selected ? this.createTransformRects() : '';
  }

  protected changeResizeDirection() {
    if (this.width < 0 && this.height < 0) {
      this.editMode = (((this.editMode - 1) + 4) % 8) + 1;
      this.position.x += this.width;
      this.position.y += this.height;
      this.width = -this.width;
      this.height = -this.height;
    } else if (this.width < 0 && [1, 5].includes(this.editMode - 1)) {
      this.editMode = (((this.editMode - 1) + 2) % 8) + 1;
      this.position.x += this.width;
      this.width = -this.width;
    } else if (this.height < 0 && [5, 1].includes(this.editMode - 1)) {
      this.editMode = (((this.editMode - 1) + 6) % 8) + 1;
      this.position.y += this.height;
      this.height = -this.height;
    } else if (this.width < 0 && [4].includes(this.editMode - 1)) {
      this.editMode = 9;
      this.position.x += this.width;
      this.width = -this.width;
    } else if (this.width < 0 && [8].includes(this.editMode - 1)) {
      this.editMode = 5;
      this.position.x += this.width;
      this.width = -this.width;
    } else if (this.height < 0 && [2, 6].includes(this.editMode - 1)) {
      this.editMode = (((this.editMode - 1) + 4) % 8) + 1;
      this.position.y += this.height;
      this.height = -this.height;
    } else if (this.width < 0 && [7, 3].includes(this.editMode - 1)) {
      this.editMode = (((this.editMode - 1) + 6) % 8) + 1;
      this.position.x += this.width;
      this.width = -this.width;
    } else if (this.height < 0 && [7, 3].includes(this.editMode - 1)) {
      this.editMode = (((this.editMode - 1) + 2) % 8) + 1;
      this.position.y += this.height;
      this.height = -this.height;
    }
  }

  private resize(position: Position): void {
    switch (this.editMode) {
      case LayoutDesignerlEditMode.Resize1:
        this.resize1(position);
        break;
      case LayoutDesignerlEditMode.Resize2:
        this.resize2(position);
        break;
      case LayoutDesignerlEditMode.Resize3:
        this.resize3(position);
        break;
      case LayoutDesignerlEditMode.Resize4:
        this.resize4(position);
        break;
      case LayoutDesignerlEditMode.Resize5:
        this.resize5(position);
        break;
      case LayoutDesignerlEditMode.Resize6:
        this.resize6(position);
        break;
      case LayoutDesignerlEditMode.Resize7:
        this.resize7(position);
        break;
      case LayoutDesignerlEditMode.Resize8:
        this.resize8(position);
        break;
      default:
        break;
    }
  }

  private resize1(position: Position) {
    this.position.x += position.x;
    this.position.y += position.y;
    this.width -= position.x;
    this.height -= position.y;
  }

  private resize2(position: Position) {
    this.position.y += position.y;
    this.height -= position.y;
  }

  private resize3(position: Position) {
    this.position.y += position.y;
    this.width += position.x;
    this.height -= position.y;
  }

  private resize4(position: Position) {
    this.width += position.x;
  }

  private resize5(position: Position) {
    this.width += position.x;
    this.height += position.y;
  }

  private resize6(position: Position) {
    this.height += position.y;
  }

  private resize7(position: Position) {
    this.position.x += position.x;
    this.width -= position.x;
    this.height += position.y;
  }

  private resize8(position: Position) {
    this.position.x += position.x;
    this.width -= position.x;
  }

  protected createTransformRects() {
    if (this.transformRects.length === 0) {
      for (let i = 1; i <= 8; i++) {
        let cornerRect = new TransformRect();;
        cornerRect.setParent(this.parent);
        cornerRect.id = 'TransformRect-' + i;
        cornerRect.create();
        this.transformRects.push(cornerRect);
      }
    }
    for (let i = 1; i <= 8; i++) {
      let cornerRect = this.transformRects[i - 1];
      cornerRect.height = this.cornerRectSize;
      cornerRect.width = this.cornerRectSize;
      switch (i) {
        case 1:
          cornerRect.position.y = (this.position.y - this.cornerRectSize / 2);
          cornerRect.position.x = (this.position.x - this.cornerRectSize / 2);
          cornerRect.cursor = 'nwse-resize';
          break;
        case 2:
          cornerRect.position.y = (this.position.y - this.cornerRectSize / 2);
          cornerRect.position.x = ((this.position.x + this.borderWidth + this.width / 2) - this.cornerRectSize / 2);
          cornerRect.cursor = 'ns-resize';
          break;
        case 3:
          cornerRect.position.y = (this.position.y - this.cornerRectSize / 2);
          cornerRect.position.x = (this.position.x + this.borderWidth * 2 + this.width - this.cornerRectSize / 2);
          cornerRect.cursor = 'nesw-resize';
          break;
        case 4:
          cornerRect.position.y = ((this.position.y + this.borderWidth + this.height / 2) - this.cornerRectSize / 2);
          cornerRect.position.x = (this.position.x + this.borderWidth * 2 + this.width - this.cornerRectSize / 2);
          cornerRect.cursor = 'ew-resize';
          break;
        case 5:
          cornerRect.position.y = (this.position.y + this.borderWidth * 2 + this.height - this.cornerRectSize / 2);
          cornerRect.position.x = (this.position.x + this.borderWidth * 2 + this.width - this.cornerRectSize / 2);
          cornerRect.cursor = 'nwse-resize';
          break;
        case 6:
          cornerRect.position.y = (this.position.y + this.borderWidth * 2 + this.height - this.cornerRectSize / 2);
          cornerRect.position.x = ((this.position.x + this.borderWidth + this.width / 2) - this.cornerRectSize / 2);
          cornerRect.cursor = 'ns-resize';
          break;
        case 7:
          cornerRect.position.y = (this.position.y + this.borderWidth * 2 + this.height - this.cornerRectSize / 2);
          cornerRect.position.x = (this.position.x - this.cornerRectSize / 2);
          cornerRect.cursor = 'nesw-resize';
          break;
        case 8:
          cornerRect.position.y = ((this.position.y + this.borderWidth + this.height / 2) - this.cornerRectSize / 2);
          cornerRect.position.x = (this.position.x - this.cornerRectSize / 2);
          cornerRect.cursor = 'ew-resize';
          break;
        default:
          break;
      }
      cornerRect.render();
    }
  }

  zoom(factor: number, center: Position, xTransParent, yTransParent): void {
    center = new Position(center.x - this.position.x, center.y - this.position.y);
    // center = this.getCenter();
    let transXFactor = center.x / (this.width + this.borderWidth * 2);
    let transYFactor = center.y / (this.height + this.borderWidth * 2);

    let widthBefore = this.width;
    this.width += factor;
    this.position.x -= (factor * transXFactor - xTransParent);


    let factorY = factor / widthBefore * this.height;
    this.position.y -= factorY * transYFactor - yTransParent;
    this.height += factorY;
  }

  abstract getCopy(): TransformableObject;

  // ?
  getAllChildren(): TransformableObject[] {
    return [];
  }

  addCurrentObjectValues(defaultObject: TransformableObject) {
    defaultObject.editableProperties.forEach(p => { this[p] = defaultObject[p] });
    defaultObject.chanceableProperties.forEach(p => { this[p] = defaultObject[p] });
  }

  getPositionAndSizeChanceSubject(): Subject<Transformation> {
    return this.positionAndSizeChanceSubject;
  }

  addClass(cssClass: CssClass): void {
    this.cssClassList.push(cssClass);
    this.updateClasses();
  }

  removeCssClass(cssClass: CssClass): void {
    this.cssClassList = this.cssClassList.filter(c => c !== cssClass);
    this.htmlElementRef.className = '';
    this.htmlElementRef.classList.add(this.type + '-' + this.id);
    this.cssClassList.forEach(c => {
      this.htmlElementRef.classList.add(c.name);
    });
  }

  updateClasses(): void {
    this.htmlElementRef.className = '';
    this.htmlElementRef.classList.add(this.type + '-' + this.id);
    this.cssClassList.forEach(c => {
      this.htmlElementRef.classList.add(c.name);
    });
  }

  getCss():string {
    return ''
  }
}