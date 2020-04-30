import { TransformableObject } from "../TransformableObject";
import { EditField } from '../EditField';
import { Position } from '../../Position';

export class TextField extends TransformableObject {
    icon: string = 'title';
    type = 'TextField';

    backgroundColor = 'none';
    typeName = 'Text';
    text = 'hallo';

    fontStyle: string = 'normal';
    fontVariant: string = 'normal';
    fontWeight: string = 'normal';
    fontSize: number = 10;
    fontFamily: string = '';
    textAlign: string = 'left';
    verticalAlign: string = 'top';

    fontStyleProperties = ['normal', 'italic', 'oblique', 'initial', 'inherit'];
    fontVariantProperties = ['normal', 'small-caps', 'initial', 'inherit'];
    fontWeightPropertiesNotFixed = ['normal', 'bold', 'bolder', 'lighter', 'number', 'initial', 'inherit'];
    fontSizePropertiesNotFixed = ['medium', 'xx-small', 'x-small', 'small', 'large', 'x-large', 'xx-large', 'smaller', 'larger', 'length', 'initial', 'inherit']
    fontFamilyProperties = [];
    textAlignProperties = ['right', 'center', 'left', 'justify'];
    verticalAlignProperties = ['top', 'middle', 'bottom'];


    constructor(id: string, editField: EditField) {
        super(id, editField);
        this.editableProperties = ['position.x', 'position.y', 'width', 'height', 'fontStyle', 'fontVariant', 'fontWeight', 'fontSize', 'fontFamily', 'textAlign', 'verticalAlign'];
    }

    getHTML(): string {
        let div = document.createElement('div');

        div.style.position = 'absolute';

        div.style.height = (this.height) + 'px';
        div.style.width = (this.width) + 'px';
        div.style.top = this.position.y + 'px';
        div.style.left = this.position.x + 'px';
        div.style.zIndex = this.zIndex + '';
        div.style.overflow = 'hidden';

        div.style.fontStyle = this.fontStyle;
        div.style.fontVariant = this.fontVariant;
        div.style.fontWeight = this.fontWeight;
        div.style.fontSize = this.fontSize + '';
        div.style.fontFamily = this.fontFamily;
        div.style.textAlign = this.textAlign;
        div.style.display = 'table';

        div.style.cursor = this.cursor;
        div.id = this.id;

        let div2 = document.createElement('div');
        div2.style.display = 'table-cell';
        div2.style.verticalAlign = this.verticalAlign;

        if (!this.selected) {
            div2.innerHTML = this.text;
            div.appendChild(div2);
        } else {
            let input = document.createElement('textarea');
            input.id = this.id + '-input';
            input.classList.add('textFieldInput');
            input.style.width = this.width + 'px';
            input.rows = this.text.split(/<br\s*[\/]?>/gi).length + 1
            input.innerHTML = this.text.replace(/<br\s*[\/]?>/gi, '\n');

            input.style.fontStyle = this.fontStyle;
            input.style.fontVariant = this.fontVariant;
            input.style.fontWeight = this.fontWeight;
            input.style.fontSize = this.fontSize + '';
            input.style.fontFamily = this.fontFamily;
            input.style.textAlign = this.textAlign;

            div2.appendChild(input);
            div.appendChild(div2);
            this.createTransformRects();
            let resString = div.outerHTML;

            this.transformRects.forEach(rect => {
                resString += rect.getHTML();
            })
            this.noRender = true;

            return resString;
        }

        return div.outerHTML;
    }

    unselect() {
        this.noRender = false;
        super.unselect();
    }

    transform(position: Position): void {
        this.noRender = false;
        super.transform(position);
    }

    private onInput(event: any): void {
        this.text = event.target.value;
        this.text = this.text.replace(/\n\r?/g, '<br />');
        event.target.style.height = (event.target.scrollHeight) + 'px';
    }

    addFunctions(document: Document): void {
        let element = document.getElementById(this.id + '-input');
        if (element) {
            element.addEventListener('keyup', this.onInput.bind(this));
            element.focus();
        }
    }

    getCopy(): TextField {
        let copyedObject: TextField = new TextField('', this.editField);
        for (let key in this) {
            if (key !== 'changedSubject') {
                copyedObject[key.toString()] = JSON.parse(JSON.stringify(this[key]));
            }
        }
        return copyedObject;
    }
}