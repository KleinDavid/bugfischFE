import { Component, Input, OnInit, AfterViewInit, HostListener, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'atled-layout-designer',
  templateUrl: './layout-designer.component.html',
  styleUrls: ['./layout-designer.component.scss']
})
export class LayoutDesignerComponent implements OnInit, AfterViewInit {

  @ViewChild('cardBoundary') cardBinary: ElementRef;
  rect: Rect;

  @HostListener('window:click', ['$event'])
  mouseClickEvent(event: MouseEvent) {
    if (!this.mouseIsDown) {
      return;
    }

    // onMouseup
    if (event.clientX !== this.mouseDownPosition.x || event.clientY !== this.mouseDownPosition.y) {
      this.currentCreationMode = LayoutDesignerlCreationMode.None;
      this.droped = true;
      this.selectedObject.editEnd();
      this.render();
    }

    // onClick
    else {
      if (!this.editField.checkIfObjectIsThere(event.clientX, event.clientY)) { return; }
      if (this.selectedObject) { this.selectedObject.editEnd() }
      if (!this.selectObjectByMouseClick(event.clientX, event.clientY)) { this.selectedObject = null; console.log('nunun') }
      else { this.selectedObject.select() };
      this.render();
    }
    this.mouseIsDown = false;
  }

  @HostListener('window:keyup', ['$event'])
  keyupEvent(event: KeyboardEvent) {
    if (event.code === 'Delete' && this.selectedObject) {
      this.selectedObject.delete();
      this.listOfTransformableObjects = this.listOfTransformableObjects.filter(ob => !ob.deleteState);
      this.selectedObject = null;
      this.render();
    }

    if (event.code === 'ArrowRight' && this.selectedObject) {
      this.moveObject(new Position(1, 0));
    }

    if (event.code === 'ArrowLeft' && this.selectedObject) {
      this.moveObject(new Position(-1, 0));
    }

    if (event.code === 'ArrowUp' && this.selectedObject) {
      this.moveObject(new Position(0, -1));
    }

    if (event.code === 'ArrowDown' && this.selectedObject) {
      this.moveObject(new Position(0, 1));
    }
  }

  @HostListener('window:drag', ['$event'])
  dragEvent(event: MouseEvent) {
  }

  @HostListener('window:mousedown', ['$event'])
  mouseDownEvent(event: MouseEvent) {
    this.mouseDownPosition = new Position(event.clientX, event.clientY);
    if (!this.editField.checkIfObjectIsThere(event.clientX, event.clientY)) {
      return;
    }

    this.mouseIsDown = true;
    this.lastMousePosition = new Position(event.clientX, event.clientY);

    switch (this.currentCreationMode) {
      case LayoutDesignerlCreationMode.None:
        if (!this.selectObjectByMouseClick(event.clientX, event.clientY)) {
          this.createObject(new Position(event.clientX, event.clientY));
          this.selectedObject.editMode = LayoutDesignerlEditMode.Resize5;
        }
        break;
      case LayoutDesignerlCreationMode.Rect:
        this.createObject(new Position(event.clientX, event.clientY));
        this.selectedObject.editMode = LayoutDesignerlEditMode.Resize5;
        break;
      case LayoutDesignerlCreationMode.Circle:
        this.createObject(new Position(event.clientX, event.clientY));
        this.selectedObject.editMode = LayoutDesignerlEditMode.Resize5;
        break;
      default:
        break;
    }
  }

  @HostListener('window:mouseup', ['$event'])
  mouseUpEvent(event: MouseEvent) {
    this.mouseClickEvent(event);
  }

  @HostListener('window:mousemove', ['$event'])
  mouseMoveEvent(event: MouseEvent) {
    if (this.mouseIsDown && this.selectedObject && this.editField.checkIfObjectIsThere(event.clientX, event.clientY)) {
      this.moveObject(this.lastMousePosition.getDifference(new Position(event.clientX, event.clientY)));
      this.lastMousePosition = new Position(event.clientX, event.clientY);
    }
  }

  mouseIsDown: boolean = false;
  mouseDownPosition: Position;
  droped: boolean = false;
  lastMousePosition: Position = new Position(0, 0)
  listOfTransformableObjects: TransformableObject[] = []

  selectedObject: TransformableObject;
  chipCardField: IdCard;
  editField: EditField;

  currentCreationMode: LayoutDesignerlCreationMode = LayoutDesignerlCreationMode.Edit;


  constructor(private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.chipCardField = new IdCard('idCard', this.editField);
    this.chipCardField.setOuterObject(this.chipCardField);
  }

  ngAfterViewInit() {
    this.initializeChipCardField();
    this.render()
  }

  initializeChipCardField(): void {
    let outerStyle = document.getElementById('layout-desinger-space-around').getBoundingClientRect();
    this.chipCardField.height = 540 / 2.2;
    this.chipCardField.width = 856 / 2.2;
    this.chipCardField.position.x = outerStyle.width / 2 - this.chipCardField.width / 2 + outerStyle.x;
    this.chipCardField.position.y = outerStyle.height / 2 - this.chipCardField.height / 2 + outerStyle.y;

    this.editField = new EditField();
    this.editField.position.x = outerStyle.x;
    this.editField.position.y = outerStyle.y;
    this.editField.height = outerStyle.height;
    this.editField.width = outerStyle.width;

    this.render()
  }

  dragObject(x: number, y: number) {
    this.listOfTransformableObjects.forEach(ob => {
      if (ob.checkIfObjectIsThere(x, y)) {
        this.selectedObject = ob;
      }
    });
  }

  selectObjectByMouseClick(x: number, y: number) {
    if (this.selectedObject) {
      if (this.selectedObject.checkIfObjectIsThere(x, y)) {
        return true;
      }
    }

    let found = false;

    let selectedObject: TransformableObject = null;
    this.listOfTransformableObjects.forEach(ob => {
      if (ob.checkIfObjectIsThere(x, y)) {
        selectedObject = ob;
        found = true;
      }
    });

    // 
    if (found) {
      this.selectedObject = selectedObject;
      this.unselectAllTransformableObjects();
      this.selectedObject.select();
    } else {
      this.selectedObject = null;
      this.unselectAllTransformableObjects();
    }
    this.render();
    return found
  }

  unselectAllTransformableObjects(): void {
    this.listOfTransformableObjects.forEach(ob => {
      if (ob !== this.selectedObject) {
        ob.unselect();
      }
    })
  }

  deleteUnusedObjects(): void {
    if (this.selectedObject.deleteState) {
      this.selectedObject = null;
    }
    this.listOfTransformableObjects = this.listOfTransformableObjects.filter(ob => !ob.deleteState);
  }

  moveObject(position: Position) {
    this.selectedObject.transform(position);
    this.render();
  }

  createObject(position: Position, imageSrc?: string): void {
    let id = '0'
    this.listOfTransformableObjects.forEach(ob => {
      if (parseInt(ob.id) > parseInt(id)) {
        id = (parseInt(ob.id) + 1) + ''
      }
    });

    if (LayoutDesignerlCreationMode.None == this.currentCreationMode) {
      this.selectedObject = new SelectionWrapper(id, this.editField, this.listOfTransformableObjects);
      this.selectedObject.setOuterObject(this.chipCardField);
      this.selectedObject.select();
      this.selectedObject.position = new Position(position.x, position.y);
      this.listOfTransformableObjects.forEach(ob => {
        ob.unselect()
      });
    } else if (LayoutDesignerlCreationMode.Rect == this.currentCreationMode) {
      this.selectedObject = new Rect(id, this.editField);
      this.selectedObject.setOuterObject(this.chipCardField);
      this.selectedObject.select();
      this.selectedObject.position = new Position(position.x, position.y);
      this.listOfTransformableObjects.forEach(ob => {
        ob.unselect()
      });
    } else if (LayoutDesignerlCreationMode.Image == this.currentCreationMode) {
      this.selectedObject = new EditableImage(id, this.editField, imageSrc, this.chipCardField);
      this.selectedObject.setOuterObject(this.chipCardField);
      this.selectedObject.select();
      this.selectedObject.position = new Position(position.x, position.y);
      this.currentCreationMode = LayoutDesignerlCreationMode.None;
      this.listOfTransformableObjects.forEach(ob => {
        ob.unselect()
      });
    } else if (LayoutDesignerlCreationMode.Circle == this.currentCreationMode) {
      this.selectedObject = new Circle(id, this.editField);
      this.selectedObject.setOuterObject(this.chipCardField);
      this.selectedObject.select();
      this.selectedObject.position = new Position(position.x, position.y);
      this.currentCreationMode = LayoutDesignerlCreationMode.None;
      this.listOfTransformableObjects.forEach(ob => {
        ob.unselect()
      });

    }

    this.selectedObject.getObservable().subscribe(() => {
      this.render();
    })

    this.listOfTransformableObjects.push(this.selectedObject);

    this.render();
  }

  render(): void {
    this.listOfTransformableObjects = this.listOfTransformableObjects.filter(ob => !ob.deleteState);
    this.cardBinary.nativeElement.innerHTML = '';
    this.setHtml(this.chipCardField);
    this.listOfTransformableObjects.forEach(ob => {
      this.setHtml(ob);
    });
  }

  setHtml(ob: RenderableObject): void {
    this.cardBinary.nativeElement
      .insertAdjacentHTML('beforeend', ob.render());
  }

  // Template-Functions
  changeCreationMode(mode: number): void {
    if (mode === LayoutDesignerlCreationMode.Image) {
      document.getElementById('imageUploader').click();
    }
    this.currentCreationMode = mode;
  }

  menuRightChanged(): void {
    this.selectedObject.transform(new Position(0, 0));
    this.render();
  }

  private imageSrc: string = '';

  handleInputChange(e: any) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onload = this.handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  private handleReaderLoaded(e) {
    let reader = e.target;
    this.imageSrc = reader.result;
    this.createObject(new Position(this.chipCardField.position.x, this.chipCardField.position.y), reader.result)
  }
}

abstract class RenderableObject {
  width: number;
  height: number;
  borderRadius: number = 0;
  position: Position;
  borderWidth: number = 0;
  borderColor: string = 'black';
  cursor: string = 'default';
  backgroundColor = 'none';
  borderStyle: string = 'solid';
  zIndex: number = 0;

  cornerRectSize = 11;
  transformRects: TransformRect[] = [];

  outerObject: RenderableObject;

  changedSubject: Subject<boolean> = new Subject<boolean>();

  constructor() {
    this.position = new Position();
    this.height = 0;
    this.width = 0;
  }

  render(): string {
    let div = document.createElement('div');
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
    return div.outerHTML;
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

  getObservable(): Observable<boolean> {
    return this.changedSubject.asObservable();
  }

  getBottomRightWidhtBorderIndex(): Position {
    let borderIndex = this.borderWidth % 4;
    return new Position(this.position.x + this.width + this.borderWidth * 2, this.position.y + this.height + this.borderWidth * 2);
  }
}

export class TransformableObject extends RenderableObject {

  selected: boolean = false;
  deleteState: boolean = false;

  id: string;
  editMode: LayoutDesignerlEditMode = LayoutDesignerlEditMode.None;
  editableProperties: string[] = ['position.x', 'position.y', 'width', 'height', 'borderColor', 'borderWidth', 'borderStyle', 'borderRadius', 'backgroundColor'];
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

  render(): string {
    let div = document.createElement('div');

    div.style.position = 'absolute';

    div.style.height = this.height + 'px';
    div.style.width = this.width + 'px';
    div.style.top = this.position.y + 'px';
    div.style.left = this.position.x + 'px';

    div.style.borderRadius = this.borderRadius + 'px';
    div.style.cursor = this.cursor;
    div.style.backgroundColor = this.backgroundColor;
    div.style.border = this.borderWidth + 'px ' + this.borderStyle + ' ' + this.borderColor;
    div.id = this.id;

    if (this.selected) {

      this.createTransformRects();
      let resString = div.outerHTML;

      this.transformRects.forEach(rect => {
        resString += rect.render();
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

  transform(position: Position): void {
    if (this.editMode === LayoutDesignerlEditMode.Move) {
      this.moveByDifference(position);
    } else {
      this.resize(position);
      this.changeResizeDirection();
    }
    this.createTransformRects();
    let overflowPosition = this.getOverflowOfEditField();
    if (overflowPosition.x !== 0 || overflowPosition.y !== 0) {
      this.transform(overflowPosition);
    }
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
    let positionChange = new Position(0, 0)
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
    return positionChange;
  }
}

class SelectionWrapper extends TransformableObject {
  borderWidth = 1;
  selectetObjects: TransformableObject[] = [];
  borderStyle = 'dashed';
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

  unselect() {
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
        bottomRight = new Position(o.getBottomRightWidhtBorderIndex().x, o.getBottomRightWidhtBorderIndex().y);
        this.borderIndexX = (o.borderWidth % 4) > 0 ? 0 : 1;
        this.borderIndexY = (o.borderWidth % 4) > 0 ? 0 : 1;
      }
      if (o.position.x < topLeft.x) {
        topLeft.x = o.position.x;
        this.borderIndexX = (o.borderWidth % 4) > 0 ? 0 : 1;
      }
      if (o.position.y < topLeft.y) {
        topLeft.y = o.position.y;
        this.borderIndexY = (o.borderWidth % 4) > 0 ? 0 : 1;
      }
      if (o.getBottomRightWidhtBorderIndex().x > bottomRight.x) {
        bottomRight.x = o.getBottomRightWidhtBorderIndex().x;
      }
      if (o.getBottomRightWidhtBorderIndex().y > bottomRight.y) {
        bottomRight.y = o.getBottomRightWidhtBorderIndex().y;
      }
    }
    if (!topLeft || !bottomRight || this.selectedObjects.length === 0) {
      this.delete();
      super.editEnd();
      return;
    }

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

  render(): string {
    console.log(this.borderIndexX);
    this.width -= (1 + this.borderIndexX);
    this.height -= (1 + this.borderIndexY);
    let returnValue = super.render();
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
        // o.transform(new Position(position.x / (this.width / o.width), position.y / (this.height / o.height)));

        /*if (this.width <= 1 || this.height <= 1) {
          super.transform(position);
          return;
        }
        let moveXRight = (((this.width + position.x) * (o.position.x - this.position.x)) / this.width) - (o.position.x - this.position.x);
        let moveYDown = (((this.height + position.y) * (o.position.y - this.position.y)) / this.height) - (o.position.y - this.position.y);

        let moveXLeft = -((((this.width - position.x) * (this.getTopRight().x - o.getTopRight().x)) / this.width) - (this.getTopRight().x - o.getTopRight().x));
        let moveYUp = -((((this.height - position.y) * (this.getBottomRight().y - o.getBottomRight().y)) / this.height) - (this.getBottomRight().y - o.getBottomRight().y));

        switch (this.editMode) {
          case LayoutDesignerlEditMode.Resize1:
            o.moveByDifference(new Position(moveXLeft, moveYUp));
            break;
          case LayoutDesignerlEditMode.Resize2:
            o.moveByDifference(new Position(0, moveYUp));
            break;
          case LayoutDesignerlEditMode.Resize3:
            o.moveByDifference(new Position(moveXRight, moveYUp));
            break;
          case LayoutDesignerlEditMode.Resize4:
            o.moveByDifference(new Position(moveXRight, 0));
            break;
          case LayoutDesignerlEditMode.Resize5:
            o.moveByDifference(new Position(moveXRight, moveYDown));
            break;
          case LayoutDesignerlEditMode.Resize6:
            o.moveByDifference(new Position(0, moveYDown));
            break;
          case LayoutDesignerlEditMode.Resize7:
            o.moveByDifference(new Position(moveXLeft, moveYDown));
            break;
          case LayoutDesignerlEditMode.Resize8:
            o.moveByDifference(new Position(moveXLeft, 0));
            break;
          default:
            break;
        }*/
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

class EditField extends RenderableObject {
  backgroundColor = 'white';
}

class TransformRect extends RenderableObject {
  backgroundColor = '#91a3b0';
  zIndex = 1;
}

class EditableImage extends TransformableObject {
  imageSrcBase64: string = '';
  // idCard: IdCard;
  imageOriginalWidth: number;
  imageOriginalHeight: number;
  imagePosition: LayoutDesignerImagePosition = LayoutDesignerImagePosition.Adapt;
  typeName = 'Bild';

  constructor(id: string, editField: EditField, imageSrc: string, idCard: IdCard) {
    super(id, editField);
    this.imageSrcBase64 = imageSrc;
    this.outerObject;
    this.editableProperties.concat([]);


    let i = new Image();

    i.onload = () => {
      this.width = i.width;
      this.height = i.height;
      if (this.width > idCard.width) {
        this.height = (idCard.width / this.width) * this.height;
        this.width = idCard.width;
      }

      if (this.height > idCard.height) {
        this.width = (idCard.height / this.height) * this.width;
        this.height = idCard.height;
      }
      this.imageOriginalWidth = i.width;
      this.imageOriginalHeight = i.height;
      this.changedSubject.next(true);
    }

    i.src = imageSrc;

  }

  render(): string {
    let div = document.createElement('div');

    div.style.position = 'absolute';

    div.style.height = this.height + 'px';
    div.style.width = this.width + 'px';
    div.style.top = this.position.y + 'px';
    div.style.left = this.position.x + 'px';

    div.style.borderRadius = this.borderRadius + 'px';
    div.style.cursor = this.cursor;
    div.style.backgroundColor = this.backgroundColor;
    div.style.border = this.borderWidth + 'px ' + this.borderStyle + ' ' + this.borderColor;
    div.id = this.id;

    // fill height
    if (this.imagePosition === LayoutDesignerImagePosition.AdaptWidht) {
      div.style.backgroundRepeat = 'no-repeat';
      div.style.backgroundSize = '100%';
      div.style.backgroundPosition = 'center top';
      div.style.backgroundImage = 'url(' + this.imageSrcBase64 + ')';
    }
    if (this.imagePosition === LayoutDesignerImagePosition.Adapt) {
      div.style.backgroundRepeat = 'no-repeat';
      div.style.backgroundSize = this.width + 'px ' + this.height + 'px';
      // div.style.backgroundPosition = 'center top';
      div.style.backgroundImage = 'url(' + this.imageSrcBase64 + ')';
    }
    if (this.imagePosition === LayoutDesignerImagePosition.AdaptHeight) {
      div.style.backgroundRepeat = 'no-repeat';
      div.style.backgroundSize = 'auto 100%';
      div.style.backgroundPosition = 'left top';
      div.style.backgroundImage = 'url(' + this.imageSrcBase64 + ')';
    }
    if (this.imagePosition === LayoutDesignerImagePosition.Center) {
      let divNoDrag = document.createElement('div');
      divNoDrag.style.zIndex = '1';
      divNoDrag.style.width = this.width + 'px';
      divNoDrag.style.height = this.height + 'px';
      divNoDrag.style.position = 'absolute';
      div.innerHTML = '<div class="simple-image-box"><img class="simple-image" draggable="false" src="'
        + this.imageSrcBase64
        + '" />'
        + divNoDrag.outerHTML
        + '</div>';
    }

    if (this.selected) {

      this.createTransformRects();
      let resString = div.outerHTML;

      this.transformRects.forEach(rect => {
        resString += rect.render();
      })
      return resString;
    }

    return div.outerHTML;
  }
}

class Rect extends TransformableObject {
  backgroundColor = '#8a7f8d';
  typeName = 'Rechteck';

  constructor(id: string, editField: EditField) {
    super(id, editField);
    this.editableProperties.concat([]);
  }
}

class Circle extends TransformableObject {
  backgroundColor = '#8a7f8d';
  typeName = 'Kreis';
  editableProperties = ['position.x', 'position.y', 'height', 'width', 'borderWidth', 'borderColor', 'backgroundColor']

  constructor(id: string, editField: EditField) {
    super(id, editField);
    this.editableProperties.concat([]);
  }

  render(): string {
    let div = document.createElement('div');

    div.style.position = 'absolute';

    div.style.height = (this.height + this.borderWidth * 2) + 'px';
    div.style.width = (this.width + this.borderWidth * 2) + 'px';
    div.style.top = this.position.y + 'px';
    div.style.left = this.position.x + 'px';

    div.style.cursor = this.cursor;
    div.id = this.id;

    let svg = document.createElement('svg');

    svg.setAttribute('height', (this.height + this.borderWidth * 2) + 'px');
    svg.setAttribute('width', (this.width + this.borderWidth * 2) + 'px');

    let ellipse = document.createElement('ellipse');
    ellipse.setAttribute('rx', ((this.width) / 2) + 'px');
    ellipse.setAttribute('ry', ((this.height) / 2) + 'px');
    ellipse.setAttribute('cx', ((this.width + this.borderWidth * 2) / 2) + 'px');
    ellipse.setAttribute('cy', ((this.height + this.borderWidth * 2) / 2) + 'px');
    ellipse.style.fill = this.backgroundColor;
    ellipse.style.stroke = this.borderColor;
    ellipse.style.strokeWidth = this.borderWidth + 'px';

    svg.appendChild(ellipse);
    div.appendChild(svg);

    if (this.selected) {

      this.createTransformRects();
      let resString = div.outerHTML;

      this.transformRects.forEach(rect => {
        resString += rect.render();
      })
      return resString;
    }
    return div.outerHTML;
  }

}

class IdCard extends TransformableObject {
  borderWidth = 1;
  borderRadius = 12;
  typeName = 'Arbeitsbereich'

  editableProperties = ['backgroundColor'];
}

class Position {

  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  updateByDifference(postiton: Position): void {
    this.x += postiton.x;
    this.y += postiton.y;
  }

  getDifference(position: Position): Position {
    return new Position(position.x - this.x, position.y - this.y)
  }

  transformByPosition(position: Position): void {
    this.x += position.x;
    this.y += position.y
  }
}

export enum LayoutDesignerlCreationMode {
  None,
  Rect,
  Circle,
  Text,
  Image,
  Line,
  Edit,
}

enum LayoutDesignerlEditMode {
  None,
  Move,
  Resize1,
  Resize2,
  Resize3,
  Resize4,
  Resize5,
  Resize6,
  Resize7,
  Resize8
}

export enum LayoutDesignerImagePosition {
  Center,
  Adapt,
  AdaptWidht,
  AdaptHeight
}
