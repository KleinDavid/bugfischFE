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
import { TextField } from './layout-designer-objects/RenderableObjects/TransformableObjects/TextField';
import { RenderableObject } from './layout-designer-objects/RenderableObject';
import { HTMLDialog } from './html-dialog/html-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CssClass } from './layout-designer-objects/CssClass';

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
    !this.disableAll ? this.mouseClickEventHandle(event) : '';
  }

  @HostListener('window:keyup', ['$event'])
  keyupEvent(event: KeyboardEvent) {
    !this.disableAll ? this.keyupEventHandle(event) : '';
  }

  @HostListener('window:drag', ['$event'])
  dragEvent(event: MouseEvent) {
  }

  @HostListener('window:mousedown', ['$event'])
  mouseDownEvent(event: MouseEvent) {
    !this.disableAll ? this.mouseDownEventHandle(event) : '';
  }

  @HostListener('window:mouseup', ['$event'])
  mouseUpEvent(event: MouseEvent) {
    !this.disableAll ? this.mouseClickEvent(event) : '';
  }

  @HostListener('window:mousemove', ['$event'])
  mouseMoveEvent(event: MouseEvent) {
    !this.disableAll ? this.mouseMoveEventHandle(event) : '';
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    !this.disableAll ? this.initializeIdCard() : '';
  }

  mouseIsDown: boolean = false;
  mouseDownPosition: Position;
  droped: boolean = false;
  lastMousePosition: Position = new Position(0, 0)
  listOfTransformableObjects: TransformableObject[] = [];
  disableAll = false;

  selectedObject: TransformableObject;
  copyedObject: TransformableObject;
  idCard: IdCard;
  editField: EditField;

  currentCreationMode: LayoutDesignerlCreationMode = LayoutDesignerlCreationMode.Edit;

  zoomFactor = 0;
  minZoomFactor = 0;
  maxZoomFactor = 500;
  zoomStep = 10;

  idCardDirection = 0;

  defaultRect: Rect;
  defaultCircle: Circle;
  defaultTextField: TextField;
  defaultEditableImage: EditableImage;

  currentDefaultObject: TransformableObject;

  globalCssClasses: CssClass[] = [];

  constructor(private htmlDialog: MatDialog) {
  }

  ngOnInit(): void {
    this.editField = new EditField();
    this.idCard = new IdCard('idCard');
    this.idCard.create();

    this.defaultRect = new Rect('');
    this.defaultCircle = new Circle('');
    this.defaultTextField = new TextField('');
    this.defaultEditableImage = new EditableImage('', '', this.idCard);

    this.defaultRect.editableProperties = ['borderColor', 'borderWidth', 'borderStyle', 'borderRadius', 'backgroundColor'];
    this.defaultCircle.editableProperties = ['borderWidth', 'borderColor', 'backgroundColor']
    this.defaultTextField.editableProperties = ['fontSize', 'lineHeight', 'fontFamily', 'verticalAlign', 'fontVariant'];
    this.defaultEditableImage.editableProperties = ['borderColor', 'borderWidth', 'borderStyle', 'borderRadius', 'backgroundColor'];
  }

  ngAfterViewInit() {
    this.initializeIdCard();
  }

  // init Functions
  initializeIdCard(): void {

    let outerStyle = document.getElementById('layout-desinger-space-around').getBoundingClientRect();

    this.editField.position.x = outerStyle.x;
    this.editField.position.y = outerStyle.y;
    this.editField.height = outerStyle.height;
    this.editField.width = outerStyle.width;

    if (this.idCardDirection === 0) {
      this.idCard.height = 540 / 2.2;
      this.idCard.width = 856 / 2.2;
      this.idCard.position.x = outerStyle.width / 2 - this.idCard.width / 2 + outerStyle.x - this.editField.position.x;
      this.idCard.position.y = outerStyle.height / 2 - this.idCard.height / 2 + outerStyle.y - this.editField.position.y;
    } else {
      this.idCard.width = 540 / 2.2;
      this.idCard.height = 856 / 2.2;
      this.idCard.position.x = outerStyle.width / 2 - this.idCard.width / 2 + outerStyle.x - this.editField.position.x;
      this.idCard.position.y = outerStyle.height / 2 - this.idCard.height / 2 + outerStyle.y - this.editField.position.y;
    }
    this.idCard.render();

    this.render()
  }

  // Event Functions
  mouseDownEventHandle(event: MouseEvent) {
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
      case LayoutDesignerlCreationMode.Text:
        this.createObject(new Position(event.clientX, event.clientY));
        this.selectedObject.editMode = LayoutDesignerlEditMode.Resize5;
        break;
      default:
        break;
    }
  }

  mouseClickEventHandle(event: MouseEvent) {
    if (!this.mouseIsDown) {
      return;
    }

    // onMouseup
    if (event.clientX !== this.mouseDownPosition.x || event.clientY !== this.mouseDownPosition.y) {
      this.changeCreationMode(LayoutDesignerlCreationMode.None);
      this.droped = true;
      this.selectedObject?.editEnd();
      this.render();
    }

    // onClick
    else {
      if (!this.editField.checkIfObjectIsThere(event.clientX, event.clientY)) { return; }
      if (this.selectedObject) { this.selectedObject.editEnd(); this.render(); }
      if (!this.selectObjectByMouseClick(event.clientX, event.clientY)) { this.selectedObject = this.currentDefaultObject; }
      else { this.selectedObject.select() };
    }
    this.mouseIsDown = false;
  }

  mouseMoveEventHandle(event: MouseEvent) {
    if (this.mouseIsDown && this.selectedObject && this.editField.checkIfObjectIsThere(event.clientX, event.clientY)) {
      this.moveObject(this.lastMousePosition.getDifference(new Position(event.clientX, event.clientY)));
      this.lastMousePosition = new Position(event.clientX, event.clientY);
    }
  }

  private keyupEventHandle(event: KeyboardEvent) {

    // Delete
    if (event.code === 'Delete' && this.selectedObject) {
      this.selectedObject.delete();
      this.listOfTransformableObjects = this.listOfTransformableObjects.filter(ob => !ob.deleteState);
      this.selectedObject = this.currentDefaultObject;
      this.render();
    }

    // Arrow

    // ? !this.selectedObject?.noRender
    if (!this.selectedObject && this.selectedObject) {
      if (event.code === 'ArrowRight') {
        this.moveObject(new Position(1, 0));
      }
      if (event.code === 'ArrowLeft') {
        this.moveObject(new Position(-1, 0));
      }
      if (event.code === 'ArrowUp') {
        this.moveObject(new Position(0, -1));
      }
      if (event.code === 'ArrowDown') {
        this.moveObject(new Position(0, 1));
      }
    }

    // CTRL C
    if (this.selectedObject && (event.ctrlKey || event.metaKey) && event.keyCode == 67) {
      this.copyedObject = this.copySelectedObject();
    }

    // CTRL V
    if ((event.ctrlKey || event.metaKey) && event.keyCode == 86) {
      this.addObjectToView(this.copyedObject, true);
    }
  }

  selectObjectByMouseClick(x: number, y: number): boolean {
    x = x + this.editField.scrollX - this.editField.position.x;
    y = y + this.editField.scrollY - this.editField.position.y;
    let child = this.idCard.getChildByPosition(new Position(x, y));
    if (child) {
      if (this.selectedObject !== child && this.selectedObject) { this.selectedObject.unselect(); }
      this.selectedObject = child;
      this.selectedObject.select();
      return true;
    }
    return false;
  }

  moveObject(position: Position) {
    this.selectedObject.transform(position);
    this.render();
  }

  private addObjectToView(object: TransformableObject, select: boolean = false): void {
    object.id = this.getNewObjectId();
    object.setParent(this.idCard);
    select ? object.select() : object.unselect();
    
    object.create();
    object.editEnd();  
    
    // ?
    object.getAllChildren().forEach(c => { this.addObjectToView(c); })
    this.idCard.addChild(object, true);

    this.listOfTransformableObjects.push(object);

    select && this.selectedObject ? this.selectedObject.unselect() : '';
    this.selectedObject = select ? object : this.selectedObject;
    object.render();
  }

  private copySelectedObject(): TransformableObject {
    let copy: TransformableObject;
    switch (this.selectedObject.type) {
      case 'Rect':
        copy = this.selectedObject.getCopy() as Rect;
        break;
      case 'SelectionWrapper':
        copy = this.selectedObject.getCopy() as SelectionWrapper;
        break;
      case 'EditableImage':
        copy = this.selectedObject.getCopy() as EditableImage;
        break;
      case 'TextField':
        copy = this.selectedObject.getCopy() as TextField;
        break;
      case 'Circle':
        copy = this.selectedObject.getCopy() as Circle;
        break;
      default:
        break;
    }
    return copy;
  }

  createObject(position: Position, imageSrc?: string): void {
    position = new Position(position.x + this.editField.scrollX - this.editField.position.x, position.y + this.editField.scrollY - this.editField.position.y);

    let id = this.getNewObjectId();
    console.log(id);

    if (this.selectedObject) { this.selectedObject.unselect(); }

    switch (this.currentCreationMode) {
      case LayoutDesignerlCreationMode.None:
        this.selectedObject = new SelectionWrapper(id, this.listOfTransformableObjects.filter(o => o.deleteState === false));
        break;
      case LayoutDesignerlCreationMode.Rect:
        this.selectedObject = new Rect(id);
        break;
      case LayoutDesignerlCreationMode.Image:
        this.selectedObject = new EditableImage(id, imageSrc, this.idCard);
        position = new Position(this.idCard.position.x, this.idCard.position.y);
        break;
      case LayoutDesignerlCreationMode.Circle:
        this.selectedObject = new Circle(id);
        break;
      case LayoutDesignerlCreationMode.Text:
        this.selectedObject = new TextField(id);
        break;
      default:
        break;
    }
    this.selectedObject.addCurrentObjectValues(this.defaultTextField);
    this.selectedObject.setParent(this.idCard);
    this.selectedObject.position = new Position(position.x, position.y);
    this.selectedObject.create();
    this.selectedObject.select();
    this.idCard.addChild(this.selectedObject);
    this.changeCreationMode(LayoutDesignerlCreationMode.None);

    this.selectedObject.getObservable().subscribe(() => {
      this.render();
    })

    this.listOfTransformableObjects.push(this.selectedObject);
    this.render();
  }

  render(): void {
    /*if (this.selectedObject) {
      if (this.selectedObject.noRender) {
        return;
      }
    }
    this.listOfTransformableObjects = this.listOfTransformableObjects.filter(ob => !ob.deleteState);
    // this.cardBinary.nativeElement.innerHTML = '';
   
    if (this.cardBinary.nativeElement.childen) {
      document.getElementById('idCard').removeChild(document.getElementById(this.selectedObject.id));
    }
    this.cardBinary.nativeElement
      .insertAdjacentHTML('beforeend', this.idCard.getHTML());
    this.idCard.addFunctions(document);*/
  }

  // Template-Functions
  changeCreationMode(mode: number): void {
    if (mode === LayoutDesignerlCreationMode.Image) {
      this.currentDefaultObject = this.defaultEditableImage;
      document.getElementById('imageUploader').click();
    }
    if (mode === LayoutDesignerlCreationMode.Text) {
      this.currentDefaultObject = this.defaultTextField;
    }
    if (mode === LayoutDesignerlCreationMode.Rect) {
      this.currentDefaultObject = this.defaultRect;
      
    }
    if (mode === LayoutDesignerlCreationMode.Circle) {
      this.currentDefaultObject = this.defaultCircle;
    }
    if (mode === LayoutDesignerlCreationMode.None) {
      this.currentDefaultObject = this.idCard;
    }
    this.selectedObject =
      (this.selectedObject !== this.defaultTextField
        && this.selectedObject !== this.defaultRect
        && this.selectedObject !== this.defaultEditableImage
        && this.selectedObject !== this.defaultCircle
        && this.selectedObject !== this.idCard
        && this.selectedObject)
        ? this.selectedObject
        : this.currentDefaultObject;
    this.currentCreationMode = mode;
  }

  menuRightChanged(): void {
    this.selectedObject.transform(new Position(0, 0));
    // this.selectedObject.noRender = false;
    this.render();
  }

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
    console.log(reader);
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
  }

  private getNewObjectId(): string {
    let id = '0'
    this.listOfTransformableObjects.forEach(ob => {
      if (parseInt(ob.id) >= parseInt(id)) {
        id = (parseInt(ob.id) + 1) + ''
      }
    });
    return id;
  }

  cardDirectionChange() {
    this.idCardDirection = this.idCardDirection === 0 ? 1 : 0;
    this.initializeIdCard();
  }

  visibleChange(visible: boolean) {
    this.idCard.overflow = visible ? 'visible' : 'hidden';
    this.idCard.render();
  }

  disableLayoutDesinger(event: boolean){
    this.disableAll = event;
  }
}





