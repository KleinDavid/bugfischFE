import { Component, OnInit, AfterViewInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { LayoutDesignerlCreationMode, LayoutDesignerlEditMode } from './layout-designer-objects/Enums';
import { TransformableObject } from './layout-designer-objects/RenderableObjects/TransformableObject';
import { IdCard } from './layout-designer-objects/RenderableObjects/IdCard';
import { SelectionWrapper } from './layout-designer-objects/RenderableObjects/TransformableObjects/SelectionWrapper';
import { Rect } from './layout-designer-objects/RenderableObjects/TransformableObjects/Rect';
import { Position } from './layout-designer-objects/Position';
import { EditField } from './layout-designer-objects/RenderableObjects/EditField';
import { EditableImage } from './layout-designer-objects/RenderableObjects/TransformableObjects/EditableImage';
import { Circle } from './layout-designer-objects/RenderableObjects/TransformableObjects/Circle';
import { RenderableObject } from './layout-designer-objects/RenderableObject';
import { HTMLDialog } from './html-dialog/html-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
      if (!this.editField.checkIfObjectIsThere(event.clientX, event.clientY)) { console.log('noEdi');return; }
      if (this.selectedObject) { this.selectedObject.editEnd(); this.render() }
      if (!this.selectObjectByMouseClick(event.clientX, event.clientY)) { this.selectedObject = null; }
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

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.initializeIdCard();
  }

  mouseIsDown: boolean = false;
  mouseDownPosition: Position;
  droped: boolean = false;
  lastMousePosition: Position = new Position(0, 0)
  listOfTransformableObjects: TransformableObject[] = []

  selectedObject: TransformableObject;
  idCard: IdCard;
  editField: EditField;

  currentCreationMode: LayoutDesignerlCreationMode = LayoutDesignerlCreationMode.Edit;

  zoomFactor = 0;
  minZoomFactor = 0;
  maxZoomFactor = 500;
  zoomStep = 10;


  constructor(private htmlDialog: MatDialog) {
    console.log('d')
  }

  ngOnInit(): void {
    this.idCard = new IdCard('idCard', this.editField);
    this.idCard.setOuterObject(this.idCard);
  }

  ngAfterViewInit() {
    this.initializeIdCard();
  }

  initializeIdCard(): void {
    let outerStyle = document.getElementById('layout-desinger-space-around').getBoundingClientRect();
    this.idCard.height = 540 / 2.2;
    this.idCard.width = 856 / 2.2;
    this.idCard.position.x = outerStyle.width / 2 - this.idCard.width / 2 + outerStyle.x;
    this.idCard.position.y = outerStyle.height / 2 - this.idCard.height / 2 + outerStyle.y;

    this.editField = new EditField();
    this.editField.position.x = outerStyle.x;
    this.editField.position.y = outerStyle.y;
    this.editField.height = outerStyle.height;
    this.editField.width = outerStyle.width

    this.render()
  }

  dragObject(x: number, y: number) {
    /*this.listOfTransformableObjects.forEach(ob => {
      if (ob.checkIfObjectIsThere(x, y)) {
        this.selectedObject = ob;
      }
    });*/
    // if (this.selectedObject) { this.selectedObject.unselect(); }
    let child = this.idCard.getChildByPosition(new Position(x, y));
    if (child) {
      this.selectedObject = child;
      this.selectedObject.select();
      return true;
    }
    return false;
  }

  selectObjectByMouseClick(x: number, y: number): boolean {
    /*if (this.selectedObject) {
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

    if (found) {
      this.selectedObject = selectedObject;
      this.unselectAllTransformableObjects();
      this.selectedObject.select();
    } else {
      this.selectedObject = null;
      this.unselectAllTransformableObjects();
    }
    this.render();
    return found*/
    // 
    x = x + this.editField.scrollX;
    y = y + this.editField.scrollY;
    let child = this.idCard.getChildByPosition(new Position(x, y));
    if (child) {
      if (this.selectedObject !== child && this.selectedObject) { this.selectedObject.unselect(); }
      this.selectedObject = child;
      this.selectedObject.select();
      return true;
    }
    return false;
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
    if (this.selectedObject) { this.selectedObject.unselect(); }
    if (LayoutDesignerlCreationMode.None == this.currentCreationMode) {
      this.selectedObject = new SelectionWrapper(id, this.editField, this.listOfTransformableObjects);
      this.selectedObject.setOuterObject(this.idCard);
      this.selectedObject.select();
      this.selectedObject.position = new Position(position.x, position.y);
      this.idCard.addChild(this.selectedObject);
      /*this.listOfTransformableObjects.forEach(ob => {
        ob.unselect()
      });*/
    } else if (LayoutDesignerlCreationMode.Rect == this.currentCreationMode) {
      // this.selectedObject.unselect();
      this.selectedObject = new Rect(id, this.editField);
      this.selectedObject.setOuterObject(this.idCard);
      this.selectedObject.select();
      this.selectedObject.position = new Position(position.x, position.y);
      this.idCard.addChild(this.selectedObject);
      /*this.listOfTransformableObjects.forEach(ob => {
        ob.unselect()
      });*/
    } else if (LayoutDesignerlCreationMode.Image == this.currentCreationMode) {
      this.selectedObject = new EditableImage(id, this.editField, imageSrc, this.idCard);
      this.selectedObject.setOuterObject(this.idCard);
      this.selectedObject.select();
      this.selectedObject.position = new Position(position.x, position.y);
      this.currentCreationMode = LayoutDesignerlCreationMode.None;
      this.idCard.addChild(this.selectedObject);
      /*this.listOfTransformableObjects.forEach(ob => {
        ob.unselect()
      });*/
    } else if (LayoutDesignerlCreationMode.Circle == this.currentCreationMode) {
      this.selectedObject = new Circle(id, this.editField);
      this.selectedObject.setOuterObject(this.idCard);
      this.selectedObject.select();
      this.selectedObject.position = new Position(position.x, position.y);
      this.currentCreationMode = LayoutDesignerlCreationMode.None;
      this.idCard.addChild(this.selectedObject);
      /*this.listOfTransformableObjects.forEach(ob => {
        ob.unselect()
      });*/

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
    this.setHtml(this.idCard);
    /*this.listOfTransformableObjects.forEach(ob => {
      this.setHtml(ob);
    });*/
  }

  setHtml(ob: RenderableObject): void {
    this.cardBinary.nativeElement
      .insertAdjacentHTML('beforeend', ob.getHTML());
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

  private handleReaderLoaded(e: any): void {
    let reader = e.target;
    this.imageSrc = reader.result;
    this.createObject(new Position(this.idCard.position.x, this.idCard.position.y), reader.result)
  }

  private getFinalHTML(): string {
    return this.idCard.getFinalHTML();
  }

  private openDialog(): void {
    const dialogRef = this.htmlDialog.open(HTMLDialog, {
      panelClass: 'full-width-dialog',
      autoFocus: false,
      data: { content: this.getFinalHTML() }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      let i = result;
    });
  }

  menuTopChanged(): void {
    this.openDialog();
  }

  zoomIn(): void {
    if (this.zoomFactor >= this.maxZoomFactor) {
      return;
    }
    this.zoomFactor += this.zoomStep;
    this.idCard.zoom(this.zoomStep);
    this.render()
  }

  zoomOut(): void {
    if (this.zoomFactor <= this.minZoomFactor) {
      return;
    }
    this.zoomFactor -= this.zoomStep;
    this.idCard.zoom(-this.zoomStep);
    this.render();
  }

  onScrollEditField(event: any): void {
    this.editField.scrollY = event.srcElement.scrollTop;
    this.editField.scrollX = event.srcElement.scrollLeft;
    console.log(event.srcElement.scrollTop);
  }
}





