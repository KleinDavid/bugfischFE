
import { TransformableObject } from '../TransformableObject';
import { IdCard } from '../IdCard';
import { Position } from '../../Position';
import { LayoutDesignerImagePosition } from '../../Enums';
import { CssClass } from '../../CssClass';
import { DesignerFile, DesignerFileManager } from '../../../managers/designerFileManager';

export class EditableImage extends TransformableObject {
  icon: string = 'crop_original';
  type = 'EditableImage';
  typeName = 'Bild';
  fileManager = DesignerFileManager.getInstance();

  imageSrcBase64: string = '';
  imageFile: DesignerFile;
  // idCard: IdCard;
  imageOriginalWidth: number;
  imageOriginalHeight: number;
  imagePosition: LayoutDesignerImagePosition = LayoutDesignerImagePosition.Adapt;

  simpleImageBoxRef: HTMLElement;
  simpleImageRef: HTMLImageElement;

  editableProperties: string[] = ['position.x', 'position.y', 'width', 'height', 'zIndex', 'borderColor', 'borderWidth', 'borderStyle', 'borderRadius', 'backgroundColor'];
  halfStyleProperties: string[] = ['position.x', 'position.y', 'width', 'height'];

  // EditableImage-{{id}}-style
  cssClassStyleProperties = [
    { valueName: 'position', value: 'absolute' },
    { valueName: 'border-color', value: 'black' },
    { valueName: 'border-style', value: 'solid' },
    { valueName: 'border-radius', value: '0' },
    { valueName: 'background-color', value: 'none' },
    { valueName: 'cursor', value: 'move' }
  ];

  // EditableImage-{{id}}-centered-image-parent
  cssClassCenteredImageParentProperties = [
    { valueName: 'overflow', value: 'hidden' },
    { valueName: 'width', value: '100%' },
    { valueName: 'height', value: '100%' },
    { valueName: 'position', value: 'relative' }
  ];

  // EditableImage-{{id}}-centered-image-child
  cssClassCenteredImageChildProperties = [
    { valueName: 'position', value: 'absolute' },
    { valueName: 'max-width', value: '100%' },
    { valueName: 'max-height', value: '100%' },
    { valueName: 'top', value: '0' },
    { valueName: 'bottom', value: '0' },
    { valueName: 'left', value: '0' },
    { valueName: 'right', value: '0' },
    { valueName: 'margin', value: 'auto' }
  ];

  // EditableImage-{{id}}-background
  cssClassBackgroundProperties = [
    { valueName: 'background-repeat', value: 'no-repeat' },
  ];

  cssClassBackgroundAdaptProperties = [
    { valueName: 'background-size', value: '100% 100%' },
    { valueName: 'background-position', value: 'top top' },
  ];

  cssClassBackgroundAdaptWidhtProperties = [
    { valueName: 'background-size', value: '100%' },
    { valueName: 'background-position', value: 'center top' },
  ];

  cssClassBackgroundAdaptHeightProperties = [
    { valueName: 'background-size', value: 'auto 100%' },
    { valueName: 'background-position', value: 'left top' },
  ];

  private imageClasses: CssClass[] = [];

  private cssClassBackground: CssClass;

  private wontToCreate: boolean = false;
  private imageLoaded: boolean = false;

  constructor(id: string, imageSrc: string = 'assets/default-image.png', idCard: IdCard) {
    super(id);

    this.imageSrcBase64 = 'assets/default-image.png';
    this.editableProperties.concat([]);

    let i = new Image();
    
    // i.onload = () => {
    //   this.width = i.width;
    //   this.height = i.height;
    //   if (this.width > idCard.width) {
    //     this.height = (idCard.width / this.width) * this.height;
    //     this.width = idCard.width;
    //   }

    //   if (this.height > idCard.height) {
    //     this.width = (idCard.height / this.height) * this.width;
    //     this.height = idCard.height;
    //   }
    //   this.imageOriginalWidth = i.width;
    //   this.imageOriginalHeight = i.height;
    //   this.imageLoaded = true;
    //   this.create();
    //   this.changedSubject.next(true);
    // }
    // i.src = imageSrc;

    // this.positionAndSizeChanceSubject.subscribe(transformation => {
    //   if (transformation.propertyName === 'imagePosition') {
    //     this.setImagePosition(transformation.valueAfter);
    //   }
    // })
  }

  create(): void {
    // if (!this.imageLoaded) {
    //   this.wontToCreate = true;
    //   return;
    // }
    // if (!this.wontToCreate) {
    //   return;
    // }
    if (this.selected) {
      this.select();
    }

    this.imageFile = this.fileManager.getDefaultImage();

    // html
    this.htmlElementRef = document.createElement('div');
    this.htmlElementRef.id = this.id;
    this.cssClassList.forEach(c => {
      this.htmlElementRef.classList.add(c.name);
    });
    this.htmlElementRef.classList.add(this.type + '-' + this.id);

    this.simpleImageBoxRef = document.createElement('div');
    this.simpleImageRef = document.createElement('img');

    this.simpleImageBoxRef.classList.add('simple-image-box');

    this.simpleImageRef.classList.add('simple-image');
    this.simpleImageRef.src = this.imageSrcBase64;

    this.simpleImageBoxRef.appendChild(this.simpleImageRef);


    // css
    let htmlRefList = [this.htmlElementRef];
    let id = this.type + '-' + this.id + '-position';
    this.cssClassPosition = this.createCssElement(id, [], htmlRefList);

    htmlRefList = [this.htmlElementRef];
    id = this.type + '-' + this.id + '-style';
    this.createCssElement(id, this.cssClassStyleProperties, htmlRefList);

    htmlRefList = [this.simpleImageRef];
    id = this.type + '-' + this.id + '-centerd-image-child';
    this.imageClasses.push(this.createCssElement(id, this.cssClassCenteredImageChildProperties, htmlRefList, false, false, false));

    htmlRefList = [this.simpleImageBoxRef];
    id = this.type + '-' + this.id + '-centerd-image-parent';
    this.imageClasses.push(this.createCssElement(id, this.cssClassCenteredImageParentProperties, htmlRefList, false, false, false));

    htmlRefList = [this.htmlElementRef];
    id = this.type + '-' + this.id + '-background';
    this.cssClassBackground = this.createCssElement(id, this.cssClassBackgroundProperties, htmlRefList, false, false);

    this.setImagePosition(this.imagePosition);

    document.getElementById(this.parent.id).appendChild(this.htmlElementRef);
    this.render();
  }

  private setImagePosition(value: LayoutDesignerImagePosition) {
    this.imagePosition = value;
    this.htmlElementRef.innerHTML = '';
    switch (this.imagePosition) {
      case LayoutDesignerImagePosition.AdaptWidht:
        this.cssClassBackground.setValuesByList(this.cssClassBackgroundAdaptWidhtProperties);
        this.cssClassBackground.setValue('background-image', this.imageSrcBase64);
        this.cssClassBackground.active = true;   
        this.imageClasses.forEach(c => c.active = false)
        this.cssClassBackground.setBindingByName('background-image', 'Image1');
        break;
      case LayoutDesignerImagePosition.Adapt:
        this.cssClassBackground.setValuesByList(this.cssClassBackgroundAdaptProperties);
        this.cssClassBackground.setValue('background-image', this.imageSrcBase64);
        this.cssClassBackground.active = true;        
        this.imageClasses.forEach(c => c.active = false);
        this.cssClassBackground.setBindingByName('background-image', 'Image1');
        break;
      case LayoutDesignerImagePosition.AdaptHeight:
        this.cssClassBackground.setValuesByList(this.cssClassBackgroundAdaptHeightProperties);
        this.cssClassBackground.setValue('background-image', this.imageSrcBase64);
        this.cssClassBackground.active = true;        
        this.imageClasses.forEach(c => c.active = false);
        this.cssClassBackground.setBindingByName('background-image', 'Image1');
        break;
      case LayoutDesignerImagePosition.Center:
        this.cssClassBackground.setValue('background-image', '');
        this.htmlElementRef.appendChild(this.simpleImageBoxRef);
        this.cssClassBackground.active = false;
        this.imageClasses.forEach(c => c.active = true)
        break;
      default:
        break;
    }
  }

  getCopy(): EditableImage {
    let copyedObject: EditableImage = new EditableImage('', '', new IdCard(''));
    for (let key in this) {
      if (key !== 'changedSubject' && key !== 'transformRects' && key !== 'parent' && key !== 'positionAndSizeChanceSubject') {
        copyedObject[key.toString()] = JSON.parse(JSON.stringify(this[key]));
      }
    }
    return copyedObject;
  }

  transform(position: Position) {
    super.transform(position);
    this.render();
  }

  setCssValue(valueName: string, value: string): void {
    if(valueName === 'imagePosition'){
      this.setImagePosition(parseInt(value));
      return;
    }
    super.setCssValue(valueName, value);
  }
}