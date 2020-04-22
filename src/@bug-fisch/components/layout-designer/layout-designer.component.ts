import { Component, OnInit, AfterViewInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { LayoutDesignerlCreationMode, LayoutDesignerlEditMode } from './layout-designer-objects/Enums';
import { TransformableObject } from './layout-designer-objects/TransformableObject';
import { IdCard } from './layout-designer-objects/IdCard';
import { SelectionWrapper } from './layout-designer-objects/SelectionWrapper';
import { Rect } from './layout-designer-objects/Rect';
import { Position } from './layout-designer-objects/Position';
import { EditField } from './layout-designer-objects/EditField';
import { EditableImage } from './layout-designer-objects/EditableImage';
import { Circle } from './layout-designer-objects/Circle';
import { RenderableObject } from './layout-designer-objects/RenderableObject';

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


  constructor() {
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





