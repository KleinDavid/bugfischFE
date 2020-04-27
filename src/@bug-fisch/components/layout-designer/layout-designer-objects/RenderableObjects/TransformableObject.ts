import { RenderableObject } from '../RenderableObject';
import { LayoutDesignerlEditMode } from '../Enums';
import { TransformRect } from './TransformRect';
import { EditField } from './EditField';
import { Position } from '../Position';
import { ZoomableObject } from '../ZoomableObject';

export class TransformableObject extends RenderableObject{

  selected: boolean = false;
  deleteState: boolean = false;

  id: string;
  editMode: LayoutDesignerlEditMode = LayoutDesignerlEditMode.None;
  editableProperties: string[] = ['position.x', 'position.y', 'width', 'height', 'borderColor', 'borderWidth', 'borderType', 'borderRadius', 'backgroundColor'];
  editField: EditField;
  typeName: string = '';

  relativeWidthToParent: number;
  relativeHeightToParent: number;
  relativePositionToParent: Position;

  exampleTransformRect: TransformRect = new TransformRect();
  transformRects: TransformRect[] = []

  constructor(id: string, editField: EditField) {
    super()
    this.id = id;
    this.editField = editField;
    this.createTransformRects();
    this.cursor = 'pointer';
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
    this.editMode = LayoutDesignerlEditMode.Move;
  }

  getHTML(): string {
    let div = document.createElement('div');

    div.style.position = 'absolute';

    div.style.height = this.height + 'px';
    div.style.width = this.width + 'px';
    div.style.top = this.position.y + 'px';
    div.style.left = this.position.x + 'px';

    div.style.borderRadius = this.borderRadius + 'px';
    div.style.cursor = this.cursor;
    div.style.backgroundColor = this.backgroundColor;
    div.style.border = this.borderWidth + 'px ' + this.borderType + ' ' + this.borderColor;
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
    this.selected = true;
  }

  unselect(): void {
    this.cursor = 'pointer';
    this.editMode = LayoutDesignerlEditMode.None;
    this.selected = false;
  }

  delete(): void {
    this.deleteState = true;
  }

  public moveByDifference(position: Position) {
    this.position.x += position.x;
    this.position.y += position.y;
  }

  update(): void {
    this.createTransformRects();
  }

  transform(position: Position, recursion = 0): void {
    if (this.editMode === LayoutDesignerlEditMode.Move) {
      this.moveByDifference(position);
    } else {
      this.resize(position);
      this.changeResizeDirection();
    }
    this.createTransformRects();
    let overflowPosition = this.getOverflowOfEditField();
    /*if (overflowPosition.x !== 0 || overflowPosition.y !== 0 && recursion === 0) {
      this.transform(overflowPosition, 1);
    }*/
  }

  changeResizeDirection() {
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

  resize(position: Position): void {
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
    this.transformRects = []
    for (let i = 1; i <= 8; i++) {
      let cornerRect = new TransformRect();
      cornerRect.backgroundColor = this.exampleTransformRect.backgroundColor;
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
      this.transformRects.push(cornerRect);
    }
  }

  transformByCorners(leftTop: Position, rightTop: Position, leftBottom: Position): void {
    this.position = leftTop;
    this.width = rightTop.x - leftTop.x;
    this.height = leftTop.y - leftBottom.y;
  }

  getOverflowOfEditField(): Position {
    /*  let positionChange = new Position(0, 0)
      for (let i = 1; i <= 8; i++) {
        let rect = this.transformRects[i - 1]
        if (i === 2) {
          if (rect.position.y < this.editField.position.y) {
            positionChange.y = this.editField.position.y - rect.position.y;
          }
        } else if (i === 4) {
          if (rect.position.x + rect.width > this.editField.position.x + this.editField.width) {
            positionChange.x = (this.editField.position.x + this.editField.width) - (rect.position.x + rect.width);
          }
        } else if (i === 6) {
          if (rect.position.y + rect.height > this.editField.position.y + this.editField.height) {
            positionChange.y = (this.editField.position.y + this.editField.height) - (rect.position.y + rect.height);
  
          }
        } else if (i === 8) {
          if (rect.position.x < this.editField.position.x) {
            positionChange.x = this.editField.position.x - rect.position.x;
          }
        }
      }
      return positionChange;*/
    return new Position(0, 0);
  }

  zoom(factor: number, center: Position, xTransParent, yTransParent): void {
    center = new Position(center.x - this.position.x, center.y - this.position.y);
    // center = this.getCenter();
    let transXFactor = center.x / (this.width + this.borderWidth * 2);
    let transYFactor = center.y / (this.height + this.borderWidth * 2);
    
    let widthBefore = this.width;
    this.width += factor;
    this.position.x -= (factor * transXFactor -xTransParent);
    
    
    let factorY = factor / widthBefore * this.height;
    this.position.y -= factorY * transYFactor - yTransParent;
    this.height += factorY;
  }
}