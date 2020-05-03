
import { TransformableObject } from '../TransformableObject';
import { IdCard } from '../IdCard';
import { Position } from '../../Position';
import { LayoutDesignerImagePosition } from '../../Enums';

export class EditableImage extends TransformableObject {
  icon: string = 'crop_original';
  type = 'EditableImage';
  typeName = 'Bild';
  imageSrcBase64: string = '';
  // idCard: IdCard;
  imageOriginalWidth: number;
  imageOriginalHeight: number;
  imagePosition: LayoutDesignerImagePosition = LayoutDesignerImagePosition.Adapt;

  simpleImageBoxRef: HTMLElement;
  simpleImageRef: HTMLImageElement;
  imageNoDragElement: HTMLElement;

  editableProperties: string[] = ['position.x', 'position.y', 'width', 'height', 'zIndex', 'borderColor', 'borderWidth', 'borderStyle', 'borderRadius', 'backgroundColor'];

  private wontToCreate: boolean = false;
  private imageLoaded: boolean = false;

  constructor(id: string, imageSrc: string, idCard: IdCard) {
    super(id);
    this.imageSrcBase64 = imageSrc;
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
      this.imageLoaded = true;
      this.create();
      this.changedSubject.next(true);
    }
    i.src = imageSrc;

    this.positionAndSizeChanceSubject.subscribe(transformation => {
      if(transformation.propertyName === 'imagePosition'){
        this.setImagePosition(transformation.valueAfter);
      }
    })
  }

  create(): void {
    if(!this.imageLoaded){
      this.wontToCreate = true;
      return;
    }
    if(!this.wontToCreate){
      return;
    }
    if(this.selected){
      this.select();
    }

    this.htmlElementRef = document.createElement('div');

    this.simpleImageBoxRef = document.createElement('div');
    this.simpleImageRef = document.createElement('img');
    this.imageNoDragElement = document.createElement('div');

    this.simpleImageBoxRef.classList.add('simple-image-box');

    this.simpleImageRef.classList.add('simple-image');
    this.simpleImageRef.src = this.imageSrcBase64;

    this.imageNoDragElement.style.zIndex = (this.zIndex + 1) + '';
    this.imageNoDragElement.style.width = '100%';
    this.imageNoDragElement.style.height = '100%';
    this.imageNoDragElement.style.position = 'absolute';

    this.simpleImageBoxRef.appendChild(this.simpleImageRef);
    this.simpleImageBoxRef.appendChild(this.imageNoDragElement);

    this.htmlElementRef.id = this.id;

    this.setImagePosition(this.imagePosition);

    document.getElementById(this.parent.id).appendChild(this.htmlElementRef);
    this.render();
  }

  render(): void {
    this.htmlElementRef.style.position = 'absolute';

    this.htmlElementRef.style.height = this.height + 'px';
    this.htmlElementRef.style.width = this.width + 'px';
    this.htmlElementRef.style.top = this.position.y + 'px';
    this.htmlElementRef.style.left = this.position.x + 'px';
    this.htmlElementRef.style.zIndex = this.zIndex + '';

    this.htmlElementRef.style.borderRadius = this.borderRadius + 'px';
    this.htmlElementRef.style.cursor = this.cursor;
    this.htmlElementRef.style.backgroundColor = this.backgroundColor;
    this.htmlElementRef.style.border = this.borderWidth + 'px ' + this.borderStyle + ' ' + this.borderColor;
    this.htmlElementRef.id = this.id;
  }

  private setImagePosition(value: LayoutDesignerImagePosition) {
    this.imagePosition = value;
    this.htmlElementRef.style.backgroundImage = 'none';
    this.htmlElementRef.innerHTML = '';
    switch (this.imagePosition) {
      case LayoutDesignerImagePosition.AdaptWidht:
        this.htmlElementRef.style.backgroundRepeat = 'no-repeat';
        this.htmlElementRef.style.backgroundSize = '100%';
        this.htmlElementRef.style.backgroundPosition = 'center top';
        this.htmlElementRef.style.backgroundImage = 'url(' + this.imageSrcBase64 + ')';
        break;
      case LayoutDesignerImagePosition.Adapt:
        this.htmlElementRef.style.backgroundRepeat = 'no-repeat';
        this.htmlElementRef.style.backgroundSize = '100% 100%';
        this.htmlElementRef.style.backgroundImage = 'url(' + this.imageSrcBase64 + ')';
        break;
      case LayoutDesignerImagePosition.AdaptHeight:
        this.htmlElementRef.style.backgroundRepeat = 'no-repeat';
        this.htmlElementRef.style.backgroundSize = 'auto 100%';
        this.htmlElementRef.style.backgroundPosition = 'left top';
        this.htmlElementRef.style.backgroundImage = 'url(' + this.imageSrcBase64 + ')';
        break;
      case LayoutDesignerImagePosition.Center:
        this.htmlElementRef.appendChild(this.simpleImageBoxRef);
        break;
      default:
        break;
    }
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
        resString += rect.getHTML();
      })
      return resString;
    }

    return div.outerHTML;
  }

  getCopy(): EditableImage {
    let copyedObject: EditableImage = new EditableImage('', '', new IdCard(''));
    for (let key in this) {
      if (key !== 'changedSubject') {
        copyedObject[key.toString()] = JSON.parse(JSON.stringify(this[key]));
      }
    }
    return copyedObject;
  }

  transform(position: Position) {
    super.transform(position);
    this.render();
  }
}