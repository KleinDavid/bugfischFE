import { TransformableObject } from "../TransformableObject";
import { Position } from '../../Position';
import { CssClass } from '../../CssClass';
import { DesignerBindingManager } from '../../../managers/designerBindingManager';

export class TextField extends TransformableObject {
    private bindingManager = DesignerBindingManager.getInstance();

    icon: string = 'title';
    type = 'TextField';

    backgroundColor = 'none';
    typeName = 'Text';
    text = '';
    textWithoutBindings = '';

    cssClassStyleProperties = [
        { valueName: 'position', value: 'absolute' },
        { valueName: 'cursor', value: 'move' },
        { valueName: 'display', value: 'table' },
    ];

    cssClassTextProperties = [
        { valueName: 'font-style', value: 'normal' },
        { valueName: 'font-weight', value: 'normal' },
        { valueName: 'font-size', value: '20' },
        { valueName: 'line-height', value: '24' },
        { valueName: 'font-family', value: '' },
        { valueName: 'text-align', value: 'left' },
        { valueName: 'overflow', value: 'hidden' },
        { valueName: 'text-decoration', value: 'none' },
        { valueName: 'font-variant', value: 'normal' },
        { valueName: 'vertical-align', value: 'top' },
        { valueName: 'display', value: 'table-cell' },
    ];

    cssTableCellClass = [
        { valueName: 'word-wrap', value: 'break-word' }
    ];

    cssTextFieldStaticClass = [
        { valueName: 'overflow', value: 'auto' },
        { valueName: 'border', value: '0' },
        { valueName: 'appearance', value: 'none' },
        { valueName: '-webkit-appearance', value: 'none' },
        { valueName: 'overflow', value: 'hidden' },
        { valueName: 'resize', value: 'none' },
        { valueName: 'width', value: '100%' },
    ]

    private tableCellDivRef: HTMLElement;
    private textareaElementRef: HTMLTextAreaElement;

    constructor(id: string) {
        super(id);

        // html
        this.htmlElementRef = document.createElement('div');
        this.htmlElementRef.id = this.type + '-' + this.id;
        this.cssClassList.forEach(c => {
            this.htmlElementRef.classList.add(c.name);
        });
        this.tableCellDivRef = document.createElement('div');
        this.tableCellDivRef.style.wordWrap = 'break-word;';
        this.textareaElementRef = document.createElement('textarea');
        this.textareaElementRef.addEventListener('keyup', this.onInput.bind(this));
        this.textareaElementRef.placeholder = 'text'

        this.htmlElementRef.appendChild(this.tableCellDivRef);

        // css
        this.cssClassPosition = new CssClass(this.type + '-' + this.id + '-position');
        this.cssClassPosition.menuRightEditable = true;
        this.htmlElementRef.classList.add(this.cssClassPosition.name);
        this.cssClassList.push(this.cssClassPosition);

        let styleClass = new CssClass(this.type + '-' + this.id + '-style');
        styleClass.menuRightEditable = true;
        styleClass.setValuesByList(this.cssClassStyleProperties);
        this.cssClassList.push(styleClass)
        this.htmlElementRef.classList.add(styleClass.name);

        let tableCellClass = new CssClass(this.type + '-' + this.id + '-cell');
        tableCellClass.setValuesByList(this.cssTableCellClass);
        tableCellClass.isClassOfHtmlParent = false;
        this.cssClassList.push(tableCellClass)
        this.tableCellDivRef.classList.add(tableCellClass.name);

        let textStyleClass = new CssClass(this.type + '-' + this.id + '-text');
        textStyleClass.menuRightEditable = true;
        textStyleClass.isClassOfHtmlParent = false;
        textStyleClass.setValuesByList(this.cssClassTextProperties);
        this.cssClassList.push(textStyleClass);
        this.tableCellDivRef.classList.add(textStyleClass.name);
        this.textareaElementRef.classList.add(textStyleClass.name);

        let staticClass = new CssClass(this.type + '-' + this.id + '-text-field-static');
        staticClass.isClassOfHtmlParent = false;
        staticClass.setValuesByList(this.cssTextFieldStaticClass, false);
        this.cssClassList.push(staticClass)
        this.textareaElementRef.classList.add(staticClass.name);
        staticClass.menuRightEditable = false;
    }

    create(): void {
        this.cssClassPosition.create();
        this.cssClassList.forEach(c => c.create());

        document.getElementById(this.parent.id).appendChild(this.htmlElementRef);
        this.render();
    }

    select(): void {
        if (this.selected) {
            return;
        }
        this.tableCellDivRef.innerHTML = '';
        console.log((this.cssClassList.find(c => c.name === this.type + '-' + this.id + '-text')));
        this.textareaElementRef.style.height =
            (this.text.split('<br />').length * parseInt(this.cssClassList.find(c => c.name === this.type + '-' + this.id + '-text')
                .getValueByName('line-height').value)) + 'px'
        this.tableCellDivRef.appendChild(this.textareaElementRef);
        super.select();
        this.render();
    }

    unselect(): void {
        super.unselect();
        this.bindingManager.findAndSetBindingsInString(this.text).forEach(b => {
            b.value = b.value === '' ? b.name : b.value;
        });
        this.textWithoutBindings = this.bindingManager.replaceBindingsByValueInString(this.text);
        if (this.tableCellDivRef) {
            this.tableCellDivRef.innerHTML = this.textWithoutBindings;
        }
    }

    render(): void {
        let values = [
            { valueName: 'left', value: this.position.x + '' },
            { valueName: 'top', value: this.position.y + '' },
            { valueName: 'width', value: this.width + '' },
            { valueName: 'height', value: this.height + '' },
            { valueName: 'z-index', value: this.zIndex + '' },
        ];
        this.cssClassPosition.setValuesByList(values);
    }

    transform(position: Position): void {
        this.render();
        super.transform(position);
    }

    private onInput(event: any): void {
        if (this.textareaElementRef.scrollTop > 0) {
            this.textareaElementRef.style.height = 'auto';
            this.textareaElementRef.style.height = this.textareaElementRef.scrollHeight + 'px';
        }
        if (this.textareaElementRef.scrollLeft > 0) {
            this.textareaElementRef.style.width = 'auto';
            this.textareaElementRef.style.width = this.textareaElementRef.scrollWidth + 'px';
        }
        this.text = event.target.value;

        this.text = this.text.replace(/\n\r?/g, '<br />');
    }

    getCopy(): TextField {
        let copyedObject: TextField = new TextField('');
        for (let key in this) {
            if (key !== 'changedSubject' && key !== 'transformRects' && key !== 'parent') {
                copyedObject[key.toString()] = JSON.parse(JSON.stringify(this[key]));
            }
        }
        return copyedObject;
    }

    getHTML(): string {
        return this.htmlElementRef.outerHTML.replace(this.textWithoutBindings, this.text);
    }
}