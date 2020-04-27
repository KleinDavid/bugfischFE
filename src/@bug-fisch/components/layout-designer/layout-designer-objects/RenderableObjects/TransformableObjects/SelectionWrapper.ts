import { TransformableObject } from "../TransformableObject";
import { LayoutDesignerlEditMode } from '../../Enums';
import { EditField } from '../EditField';
import { TransformRect } from '../TransformRect';
import { Position } from '../../Position';

export class SelectionWrapper extends TransformableObject {
  borderWidth = 1;
  selectetObjects: TransformableObject[] = [];
  borderType = 'dashed';
  allTransformableObjects: TransformableObject[] = [];
  selectedObjects: TransformableObject[] = [];
  editableProperties = [];
  borderIndexX = 0;
  borderIndexY = 0;

  isSelecting = true;

  constructor(id: string, editField: EditField, allTransformableObjects: TransformableObject[]) {
    super(id, editField);
    this.exampleTransformRect.backgroundColor = 'none';
    this.allTransformableObjects = allTransformableObjects;
  }

  delete(): void {
    this.selectedObjects.forEach(o => {
      o.delete();
    });
    super.delete();
  }

  select(): void{
    this.deleteState = false;
    super.select();
  }

  unselect(): void {
    this.deleteState = true;
    super.unselect();
  }

  checkIfObjectIsThere(x: number, y: number): boolean {
    let returnValue = super.checkIfObjectIsThere(x, y);
    this.selectedObjects.forEach(o => {
      o.editMode = this.editMode;
    });
    return returnValue;
  }

  editEnd(): void {
    let exRect = new TransformRect()
    this.exampleTransformRect.backgroundColor = exRect.backgroundColor;

    let topLeft: Position;
    let bottomRight: Position;

    if (this.isSelecting) {
      this.selectedObjects = [];
      for (let o of this.allTransformableObjects) {
        if (this.checkIfThisObjectIsInObject(o)) {
          this.selectedObjects.push(o);
        }
      }
    }

    for (let o of this.selectedObjects) {
      if (!topLeft) {
        topLeft = new Position(o.position.x, o.position.y);
      }
      if (!bottomRight) {
        bottomRight = new Position(o.getBottomRight().x, o.getBottomRight().y);
        this.borderIndexX = (o.borderWidth % 4) > 0 ? 1 : 0;
        this.borderIndexY = (o.borderWidth % 4) > 0 ? 1 : 0;
      }
      if (o.position.x < topLeft.x) {
        topLeft.x = o.position.x;
        this.borderIndexX = (o.borderWidth % 4) > 0 ? 1 : 0;
      }
      if (o.position.y < topLeft.y) {
        topLeft.y = o.position.y;
        this.borderIndexY = (o.borderWidth % 4) > 0 ? 1 : 0;
      }
      if (o.getBottomRight().x > bottomRight.x) {
        bottomRight.x = o.getBottomRight().x;
      }
      if (o.getBottomRight().y > bottomRight.y) {
        bottomRight.y = o.getBottomRight().y;
      }
    }
    if (!topLeft || !bottomRight || this.selectedObjects.length === 0) {
      this.delete();
      super.editEnd();
      return;
    }
    console.log(this)

    this.position = topLeft;
    this.width = bottomRight.x - topLeft.x;
    this.height = bottomRight.y - topLeft.y;

    if (this.isSelecting) {
      for (let o of this.selectedObjects) {
        o.relativeWidthToParent = (o.width + o.borderWidth * 2) / this.width;
        o.relativeHeightToParent = (o.height + o.borderWidth * 2) / this.height;
        let x = (o.position.x - this.position.x) / this.width;
        let y = (o.position.y - this.position.y) / this.height;
        o.relativePositionToParent = new Position(x, y);
      }
    }

    this.isSelecting = false;
    this.select();
    super.editEnd();

    this.createTransformRects();
  }

  getHTML(): string {
    this.width -= (1 + this.borderIndexX);
    this.height -= (1 + this.borderIndexY);
    let returnValue = super.getHTML();
    this.width += (1 + this.borderIndexX);
    this.height += (1 + this.borderIndexY);
    return returnValue;
  }

  transform(position: Position) {
    super.transform(position);
    this.selectedObjects.forEach(o => {
      //o.editMode = this.editMode;
      if (this.editMode === LayoutDesignerlEditMode.Move) {
        o.transform(position);
      } else {
        let directionRight = false;
        let directionBottom = false;
        switch (this.editMode) {
          case LayoutDesignerlEditMode.Resize3:
            directionRight = true;
            break;
          case LayoutDesignerlEditMode.Resize4:
            directionRight = true;
            break;
          case LayoutDesignerlEditMode.Resize5:
            directionRight = true;
            directionBottom = true;
            break;
          case LayoutDesignerlEditMode.Resize6:
            directionBottom = true;
            break;
          case LayoutDesignerlEditMode.Resize7:
            directionBottom = true;
            break;
          default:
            break;
        }

        let x = (this.width * o.relativePositionToParent.x + this.position.x) - o.position.x;
        let y = (this.height * o.relativePositionToParent.y + this.position.y) - o.position.y;
        let width: number;
        let height: number;
        if (directionRight) {
          width = (this.width * o.relativeWidthToParent) - (o.width);
        } else {
          width = -(o.width - (this.width * o.relativeWidthToParent));
        }
        if (directionBottom) {
          height = (this.height * o.relativeHeightToParent) - o.height;
        } else {
          height = -(o.height - (this.height * o.relativeHeightToParent));
        }
        o.width += (width - o.borderWidth * 2);
        o.height += (height - o.borderWidth * 2);
        o.position.x += x;
        o.position.y += y;
        o.editEnd()
      }
    });
  }

  changeResizeDirection(): void {
    let preDirection = this.editMode;
    super.changeResizeDirection();
    if (preDirection !== this.editMode) {
      for (let o of this.selectedObjects) {
        o.editMode = this.editMode;
        let newRelX = o.relativePositionToParent.x;
        let newRelY = o.relativePositionToParent.y;
        if (this.getDirectionChangedToLeft(preDirection, this.editMode)) {
          newRelX = 1 - o.relativePositionToParent.x - o.relativeWidthToParent;
        }
        if (this.getDirectionChangedToTop(preDirection, this.editMode)) {
          newRelY = 1 - o.relativePositionToParent.y - o.relativeHeightToParent;
        }
        if (this.getDirectionChangedToRight(preDirection, this.editMode)) {
          newRelX = 1 - (o.relativePositionToParent.x + o.relativeWidthToParent);
        }
        if (this.getDirectionChangedToBottom(preDirection, this.editMode)) {
          newRelY = 1 - (o.relativePositionToParent.y + o.relativeHeightToParent);
        }
        o.relativePositionToParent = new Position(newRelX, newRelY);
      }
    }
  }

  getDirectionChangedToRight(modePre: LayoutDesignerlEditMode, modeNew: LayoutDesignerlEditMode): boolean {
    let left = [LayoutDesignerlEditMode.Resize1, LayoutDesignerlEditMode.Resize8, LayoutDesignerlEditMode.Resize7];
    let right = [LayoutDesignerlEditMode.Resize3, LayoutDesignerlEditMode.Resize4, LayoutDesignerlEditMode.Resize5];
    if (left.includes(modePre) && right.includes(modeNew)) {
      return true;
    }
    return false;
  }

  getDirectionChangedToLeft(modePre: LayoutDesignerlEditMode, modeNew: LayoutDesignerlEditMode): boolean {
    let left = [LayoutDesignerlEditMode.Resize1, LayoutDesignerlEditMode.Resize8, LayoutDesignerlEditMode.Resize7];
    let right = [LayoutDesignerlEditMode.Resize3, LayoutDesignerlEditMode.Resize4, LayoutDesignerlEditMode.Resize5];
    if (right.includes(modePre) && left.includes(modeNew)) {
      return true;
    }
    return false;
  }

  getDirectionChangedToBottom(modePre: LayoutDesignerlEditMode, modeNew: LayoutDesignerlEditMode): boolean {
    let top = [LayoutDesignerlEditMode.Resize1, LayoutDesignerlEditMode.Resize2, LayoutDesignerlEditMode.Resize3];
    let bottom = [LayoutDesignerlEditMode.Resize5, LayoutDesignerlEditMode.Resize6, LayoutDesignerlEditMode.Resize7];
    if (top.includes(modePre) && bottom.includes(modeNew)) {
      return true;
    }
    return false;
  }

  getDirectionChangedToTop(modePre: LayoutDesignerlEditMode, modeNew: LayoutDesignerlEditMode): boolean {
    let top = [LayoutDesignerlEditMode.Resize1, LayoutDesignerlEditMode.Resize2, LayoutDesignerlEditMode.Resize3];
    let bottom = [LayoutDesignerlEditMode.Resize5, LayoutDesignerlEditMode.Resize6, LayoutDesignerlEditMode.Resize7];
    if (bottom.includes(modePre) && top.includes(modeNew)) {
      return true;
    }
    return false;
  }
}