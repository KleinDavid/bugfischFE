import { DesignerBindingManger } from '../managers/designerBindingManager';

export class CssClass {
    private factory = ValueFactory.getInstace();
    private styleSheet: HTMLStyleElement;
    private bindingManger: DesignerBindingManger;

    active: boolean = true;
    isClassOfHtmlParent: boolean = true;

    menuRightEditable: boolean = false;
    valueList: CssClassValue[] = [];
    name: string = '';

    constructor(name = '') {
        this.bindingManger = DesignerBindingManger.getInstance();
        this.name = name;
    }

    create(): void {
        if (!this.name) {
            return;
        }
        this.styleSheet = this.styleSheet ? this.styleSheet : document.createElement('style');
        this.styleSheet.type = 'text/css';
        this.styleSheet.innerHTML = this.getCssString();
        document.getElementsByTagName('head')[0].appendChild(this.styleSheet);
    }

    update(): void {
        if (!this.styleSheet) {
            return;
        }
        this.styleSheet.innerHTML = this.getCssString();
    }

    delete() {
        this.styleSheet ? this.styleSheet.parentNode.removeChild(this.styleSheet) : '';
    }

    setValue(valueName: string, value: string = '', withFactory = true): void {
        let oldValue = this.valueList.find(v => v.valueName === valueName);
        if (oldValue) {
            value = value.replace(oldValue.preText, '').replace(oldValue.afterText, '');
            if(valueName === 'background-image'){
                console.log(value+oldValue.binding);
            }
            if(oldValue.binding === value){
                return;
            }
            oldValue.value = oldValue.valueType === CssValueType.NUMBER ? (parseInt(value) | 0) + '' : value;;
        } else {
            let newValue = withFactory ? this.factory.getNewCssClassValue(valueName) : null;
            newValue = !newValue ? new CssClassValue(valueName, value) : newValue;
            newValue.value = newValue.valueType === CssValueType.NUMBER ? (parseInt(value) | 0) + '' : value.replace(newValue.preText, '').replace(newValue.afterText, '');;
            this.valueList.push(newValue);
        }
        this.update();
    }

    setValuesByList(values: { valueName: string, value: string }[], withFactory = true): void {
        values.forEach(v => this.setValue(v.valueName, v.value, withFactory));
    }

    getValueByName(valueName: string) {
        return this.valueList.find(v => v.valueName === valueName);
    }

    getValueString(): string {
        let returnString = '';
        this.valueList.forEach(v => {
            returnString += v.getValueCssString() + '\n';
        });
        return this.bindingManger.replaceBindingsByValueInString(returnString);
    }

    getValueStringWithBinding(): string {
        let returnString = '';
        this.valueList.forEach(v => {
            returnString += v.getValueCssStringWithBinding() + '\n';;
        });
        return returnString;
    }

    getCssString(): string {
        let valueString = '';
        this.valueList.forEach(v => {
            valueString += v.getValueCssString() + '\n';
        });
        return this.bindingManger.replaceBindingsByValueInString('.' + this.name + '{' + valueString + '}');
    }

    setValuesByValueString(valueString: string): void {
        this.valueList = [];
        let properies = valueString.replace(/\n\r?/g, '').split(';').filter(p => p.includes(':'));
        properies.forEach(p => {
            let valueName = p.split(':')[0].replace(' ', '');
            let value = p.split(':')[1];
            let valueString = '';
            let counter = 1;
            let valueStringWordList = value.split(' ').filter(v => v !== '');
            valueStringWordList.forEach(v => {
                if (counter === valueStringWordList.length) {
                    valueString += v;
                } else {
                    valueString += v + ' ';
                }
                counter++;
            });
            console.log('+' + valueString + '+', value.split(' '));
            this.setValue(valueName, valueString);
        });
    }

    getCopy(): CssClass {
        let newClass = new CssClass();
        Object.assign(newClass, JSON.parse(JSON.stringify(this)));
        newClass.factory = ValueFactory.getInstace();
        newClass.bindingManger = DesignerBindingManger.getInstance();
        let valueList = [];
        this.valueList.forEach(v => {
            let newValue = new CssClassValue('');
            Object.assign(newValue, JSON.parse(JSON.stringify(v)));
            valueList.push(newValue);
        })
        newClass.valueList = valueList;
        return newClass;
    }

    setBindingByName(valueName: string, binding: string): void {
        let value = this.valueList.find(v => v.valueName === valueName);
        if(!value){
            return;
        }
        value.binding = binding;
    }
}

export class CssClassValue {
    valueName: string;
    value: string = '';
    valueType: CssValueType = CssValueType.STRING;

    editable: boolean = false;
    smallEditField: boolean = false;

    binding: string = '';
    preText: string = '';
    afterText: string = '';
    minValue: number = Number.MIN_SAFE_INTEGER;
    maxValue: number = Number.MAX_SAFE_INTEGER;

    selectProperties: string[] = [];

    constructor(valueName: string, value?: any, valueType?: CssValueType, editable?: boolean,
        smallEditField?: boolean, binding?: string, preText?: string, afterText?: string, minValue?: number, maxValue?: number) {
        this.valueName = valueName;
        this.value = value ? value : this.value;
        this.valueType = valueType ? valueType : this.valueType;
        this.editable = editable ? editable : this.editable;
        this.smallEditField = smallEditField ? smallEditField : this.smallEditField;
        this.binding = binding ? binding : this.binding;
        this.preText = preText ? preText : this.preText;
        this.afterText = afterText ? afterText : this.afterText;
        this.minValue = minValue ? minValue : this.minValue;
        this.maxValue = maxValue ? maxValue : this.maxValue;
    }

    getValueCssString(): string {
        return this.valueName + ': ' + this.preText + this.value + this.afterText + ';';
    }

    getValueCssStringWithBinding(): string {
        return this.valueName + ': ' + this.preText + (this.binding ? this.binding : this.value) + this.afterText + ';';
    }
}

class ValueFactory {
    private static instance: ValueFactory;

    private top = new CssClassValue('top', '', CssValueType.NUMBER, true, true, '', '', 'px');
    private left = new CssClassValue('left', '', CssValueType.NUMBER, true, true, '', '', 'px');
    private heihgt = new CssClassValue('height', '', CssValueType.NUMBER, true, true, '', '', 'px', 0);
    private width = new CssClassValue('width', '', CssValueType.NUMBER, true, true, '', '', 'px', 0);
    private zIndex = new CssClassValue('z-index', '', CssValueType.NUMBER, true, false, '', '', '', 0, 999);

    private borderWidth = new CssClassValue('border-width', '', CssValueType.NUMBER, true, false, '', '', 'px', 0);
    private borderRadius = new CssClassValue('border-radius', '', CssValueType.NUMBER, true, false, '', '', 'px', 0);
    private borderColor = new CssClassValue('border-color', '', CssValueType.COLOR, true, false, '', '', '');
    private borderStyle = new CssClassValue('border-style', '', CssValueType.SELECT, true, false, '', '', '');

    private overflow = new CssClassValue('overflow', '', CssValueType.SELECT, true, false, '', '', '');

    private fontStyle = new CssClassValue('font-style', '', CssValueType.SELECT, false, false, '', '', '');
    private fontVariant = new CssClassValue('font-variant', '', CssValueType.SELECT, true, false, '', '', '');
    private fontWeight = new CssClassValue('font-weight', '', CssValueType.STRING_AND_SELECT, false, false, '', '', '');
    private fontSize = new CssClassValue('font-size', '', CssValueType.NUMBER, true, true, '', '', 'px', 0);
    private fontFamily = new CssClassValue('font-family', '', CssValueType.STRING, false, false, '', '"', '"');
    private textAlign = new CssClassValue('text-align', '', CssValueType.SELECT, false, false, '', '', '');
    private verticalAlign = new CssClassValue('vertical-align', '', CssValueType.SELECT, true, false, '', '', '');
    private lineHeight = new CssClassValue('line-height', '', CssValueType.NUMBER, true, true, '', '', 'px', 0);
    private textDecoration = new CssClassValue('text-decoration', '', CssValueType.STRING, false, false, '', '', '');

    private backgroundRepeat = new CssClassValue('background-repeat', '', CssValueType.STRING, true, false, '', '', '');
    private backgroundSize = new CssClassValue('background-size', '', CssValueType.STRING, true, false, '', '', '');
    private backgroundPosition = new CssClassValue('background-position', '', CssValueType.STRING, true, false, '', '', '');
    private backgroundImage = new CssClassValue('background-image', '', CssValueType.STRING, true, false, '', 'url(', ')');
    private backgroundColor = new CssClassValue('background-color', '', CssValueType.COLOR, true, false, '', '', '');

    private fill = new CssClassValue('fill', '', CssValueType.COLOR, true, false, '', '', '');
    private stronk = new CssClassValue('stroke', '', CssValueType.COLOR, true, false, '', '', '');
    private stringWidth = new CssClassValue('stroke-width', '', CssValueType.NUMBER, true, false, '', '', 'px');

    private cursor = new CssClassValue('cursor', '', CssValueType.SELECT, false, false, 'default', '', '');

    private borderStyleProperties = ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset'];
    private overflowProperties = ['visible', 'hidden', 'scroll', 'auto']
    private fontStyleProperties = ['normal', 'italic', 'oblique'];
    private fontVariantProperties = ['normal', 'small-caps'];
    private fontWeightProperties = ['normal', 'bold', 'bolder', 'lighter'];
    private textAlignProperties = ['left', 'center', 'right', 'justify'];
    private verticalAlignProperties = ['top', 'middle', 'bottom'];

    private defaultValues: CssClassValue[];

    public static getInstace(): ValueFactory {
        if (!this.instance) {
            this.instance = new ValueFactory();
        }
        return this.instance;
    }

    private constructor() {
        this.borderStyle.selectProperties = this.borderStyleProperties;
        this.overflow.selectProperties = this.overflowProperties;
        this.fontStyle.selectProperties = this.fontStyleProperties;
        this.fontVariant.selectProperties = this.fontVariantProperties;
        this.fontWeight.selectProperties = this.fontWeightProperties;
        this.textAlign.selectProperties = this.textAlignProperties;
        this.verticalAlign.selectProperties = this.verticalAlignProperties;

        this.defaultValues =
            [this.top, this.left, this.heihgt, this.width, this.zIndex, this.borderWidth, this.borderStyle,
            this.borderRadius, this.borderColor, this.borderStyle, this.fontVariant, this.fontWeight, this.fontSize, this.fontFamily,
            this.textAlign, this.verticalAlign, this.lineHeight, this.textDecoration, this.backgroundRepeat, this.backgroundSize,
            this.backgroundPosition, this.backgroundImage, this.backgroundColor, this.cursor, this.fill, this.stronk, this.stringWidth]
    }

    public getNewCssClassValue(valueName: string): CssClassValue {
        let newValue = this.defaultValues.find(v => v.valueName === valueName);
        if (!newValue) {
            return null;
        }
        let returnValue = new CssClassValue('');
        Object.assign(returnValue, JSON.parse(JSON.stringify(newValue)))
        return returnValue;
    }
}

export enum CssValueType {
    STRING,
    STRING_AND_SELECT,
    SELECT,
    NUMBER,
    COLOR,
}