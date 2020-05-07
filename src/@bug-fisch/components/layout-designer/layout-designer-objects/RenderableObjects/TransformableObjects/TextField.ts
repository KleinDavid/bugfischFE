import { TransformableObject } from "../TransformableObject";
import { EditField } from '../EditField';
import { Position } from '../../Position';
import { Input } from '@angular/core';

export class TextField extends TransformableObject {
    icon: string = 'title';
    type = 'TextField';

    backgroundColor = 'none';
    typeName = 'Text';
    text = '';

    fontStyle: string = 'normal';
    fontVariant: string = 'normal';
    fontWeight: string = 'normal';
    fontSize: number = 20;
    fontFamily: string = '';
    textAlign: string = 'left';
    verticalAlign: string = 'top';
    lineHeight: number = 24;
    textDecoration: string = 'none';

    fontStyleProperties = ['normal', 'italic', 'oblique'];
    fontVariantProperties = ['normal', 'small-caps'];
    fontWeightPropertiesNotFixed = ['normal', 'bold', 'bolder', 'lighter'];
    // fontSizePropertiesNotFixed = ['medium', 'xx-small', 'x-small', 'small', 'large', 'x-large', 'xx-large', 'smaller', 'larger']
    fontFamilyProperties = [];
    textAlignProperties = ['left', 'center', 'right', 'justify'];
    verticalAlignProperties = ['top', 'middle', 'bottom'];

    editableProperties = ['position.x', 'position.y', 'width', 'height', 'zIndex', 'fontSize', 'lineHeight', 'verticalAlign', 'fontVariant'];
    chanceableProperties = ['fontWeight', 'fontStyle', 'textDecoration', 'textAlign', 'fontFamily']
    halfStyleProperties: string[] = ['position.x', 'position.y', 'width', 'height', 'fontSize', 'lineHeight'];

    private tableCellDivRef: HTMLElement;
    private textareaElementRef: HTMLTextAreaElement;

    constructor(id: string) {
        super(id);
    }

    create(): void {

        this.styleSheet = document.createElement('style');
        this.styleSheet.type = 'text/css';
        this.styleSheet.innerHTML = this.getCss();
        let documentHead = document.getElementsByTagName('head')[0];
        documentHead.insertBefore(this.styleSheet, documentHead.firstChild);

        this.htmlElementRef = document.createElement('div');
        this.htmlElementRef.id = this.id;
        this.cssClassList.forEach(c => {
            this.htmlElementRef.classList.add(c.name);
        });
        this.htmlElementRef.classList.add(this.type + '-' + this.id);


        this.tableCellDivRef = document.createElement('div');
        this.tableCellDivRef.style.wordWrap = 'break-word;';
        this.textareaElementRef = document.createElement('textarea');
        this.textareaElementRef.addEventListener('keyup', this.onInput.bind(this));
        this.textareaElementRef.placeholder = 'text'

        this.htmlElementRef.appendChild(this.tableCellDivRef);

        document.getElementById(this.parent.id).appendChild(this.htmlElementRef);
        this.render();
    }

    render(): void {
        if (!this.styleSheet) { return; }
        this.styleSheet.innerHTML = this.getCss();

        this.textareaElementRef.style.width = '100%';

        this.tableCellDivRef.style.display = 'table-cell';
        this.tableCellDivRef.style.verticalAlign = this.verticalAlign;
        this.tableCellDivRef.style.lineHeight = this.lineHeight + 'px';

        if (this.selected) {
            this.textareaElementRef.id = this.id + '-input';
            this.textareaElementRef.classList.add('textFieldInput');
            this.textareaElementRef.rows = this.text.split(/<br\s*[\/]?>/gi).length + 1
            this.textareaElementRef.innerHTML = this.text.replace(/<br\s*[\/]?>/gi, '\n');

            this.textareaElementRef.style.fontStyle = this.fontStyle;
            this.textareaElementRef.style.fontVariant = this.fontVariant;
            this.textareaElementRef.style.fontWeight = this.fontWeight;
            this.textareaElementRef.style.fontSize = this.fontSize + 'px';
            this.textareaElementRef.style.fontFamily = '"' +this.fontFamily + '"';
            this.textareaElementRef.style.textAlign = this.textAlign;
            this.textareaElementRef.style.lineHeight = this.lineHeight + 'px';
            this.textareaElementRef.style.textDecoration = this.textDecoration;
        }
    }

    select() {
        if (this.selected) {
            return;
        }
        this.tableCellDivRef.innerHTML = '';
        this.tableCellDivRef.appendChild(this.textareaElementRef);
        super.select();
        this.render();
    }

    unselect() {
        super.unselect();
        if (this.tableCellDivRef) {
            this.tableCellDivRef.innerHTML = this.text;
        }
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
        div.style.fontSize = this.fontSize + 'px';
        div.style.fontFamily ='"'+ this.fontFamily+'"';
        div.style.textAlign = this.textAlign;
        div.style.display = 'table';

        div.style.cursor = this.cursor;

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
            input.style.fontSize = this.fontSize + 'px';
            input.style.fontFamily = '"' +this.fontFamily +'"';
            input.style.textAlign = this.textAlign;

            div2.appendChild(input);
            div.appendChild(div2);
            this.createTransformRects();
            let resString = div.outerHTML;

            this.transformRects.forEach(rect => {
                resString += rect.getHTML();
            })
            // this.noRender = true;

            return resString;
        }

        return div.outerHTML;
    }

    transform(position: Position): void {
        this.render();
        super.transform(position);
    }

    private onInput(event: any): void {
        if (this.textareaElementRef.scrollTop > 0) {
            this.textareaElementRef.style.height = 'auto';
            this.textareaElementRef.style.height = this.textareaElementRef.scrollHeight + 'px';
            // let words = event.target.value.split(' ');
            // words[words.length - 1] = '\n' + words[words.length - 1]
            // let nextValue = '';
            // for(let i = 0; i < words.length - 1; i++){
            //     nextValue += words[i] + ' ';
            // }
            // nextValue += words[words.length - 1];
            // event.target.value = nextValue;
        }
        if (this.textareaElementRef.scrollLeft > 0) {
            this.textareaElementRef.style.width = 'auto';
            this.textareaElementRef.style.width = this.textareaElementRef.scrollWidth + 'px';
        }
        this.text = event.target.value;
        console.log(this.textareaElementRef.scrollTop > 0);

        this.text = this.text.replace(/\n\r?/g, '<br />');
        // this.textareaElementRef.style.height = ((this.text.split('<br />').length) * this.lineHeight) + 'px';
        // event.target.style.height = (event.target.scrollHeight) + 'px';
    }

    addFunctions(document: Document): void {
        let element = document.getElementById(this.id + '-input');
        if (element) {
            element.addEventListener('keyup', this.onInput.bind(this));
            element.focus();
        }
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

    getCss(): string {
        let res = '.' + this.type + '-' + this.id + '{\n';
        res += this.getInnerCss();
        res += '}\n\n';
        return res;
    }

    private getInnerCss(): string {
        let res = ''
        res += 'position: ' + 'absolute' + ';\n';

        res += 'height: ' + Math.round(this.height) + 'px' + ';\n';
        res += 'width: ' + Math.round(this.width) + 'px' + ';\n';
        res += 'max-width: ' + Math.round(this.width) + 'px' + ';\n';
        res += 'top: ' + Math.round(this.position.y) + 'px' + ';\n';
        res += 'left: ' + Math.round(this.position.x) + 'px' + ';\n';
        res += 'z-index: ' + this.zIndex + '' + ';\n';
        res += 'overflow: ' + 'hidden' + ';\n';

        res += 'font-style: ' + this.fontStyle + ';\n';
        res += 'font-variant: ' + this.fontVariant + ';\n';
        res += 'font-weight: ' + this.fontWeight + ';\n';
        res += 'font-size: ' + this.fontSize + 'px' + ';\n';
        res += 'font-family: "' + this.fontFamily + '";\n';
        res += 'text-align: ' + this.textAlign + ';\n';
        res += 'display: ' + 'table' + ';\n';
        res += 'overflow: hidden;';
        res += 'text-decoration: ' + this.textDecoration + ';\n';

        res += 'cursor: ' + this.cursor + ';\n';
        return res;
    }
}