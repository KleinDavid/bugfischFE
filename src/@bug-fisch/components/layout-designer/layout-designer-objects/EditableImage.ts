import { LayoutDesignerImagePosition } from "./Enums";
import { TransformableObject } from './TransformableObject';
import { IdCard } from './IdCard';
import { EditField } from './EditField';

export class EditableImage extends TransformableObject {
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
      div.style.border = this.borderWidth + 'px ' + this.borderType + ' ' + this.borderColor;
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