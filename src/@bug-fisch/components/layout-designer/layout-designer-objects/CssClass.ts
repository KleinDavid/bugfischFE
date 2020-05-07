export class CssClass {
    private factory = ValueFactory.getInstace();
    private styleSheet: HTMLStyleElement;

    private valueList: CssClassValue[] = [];
    name: string = '';

    constructor() { }

    create(): void {
        if (!this.name) {
            return;
        }
        this.styleSheet = this.styleSheet ? this.styleSheet : document.createElement('style');
        this.styleSheet.type = 'text/css';
        this.styleSheet.innerHTML = this.getCssString();
        document.getElementsByTagName('head')[0].appendChild(this.styleSheet);
    }

    delete() {
        this.styleSheet ? this.styleSheet.parentNode.removeChild(this.styleSheet) : '';
    }

    setValue(valueName: string, value: string = ''): void {
        let oldValue = this.valueList.find(v => v.valueName === valueName)
        if (oldValue) {
            oldValue.value = value;
        } else {
            let newValue = this.factory.getNewCssClassValue(valueName);
            newValue = !newValue ? new CssClassValue(valueName, value) : newValue;
            newValue.value = value;
            this.valueList.push(newValue);
        }
    }

    setValuesByList(values: { valueName: string, value: string }[]): void {
        values.forEach(v => this.setValue(v.valueName, v.value));
    }

    getCssString(): string {
        let valueString = '';
        this.valueList.forEach(v => {
            valueString += v.getValueCssString() + '\n';
        })
        return '.' + this.name + '{' + valueString + '}';
    }
}

export class CssClassValue {
    valueName: string;
    value: string = '';
    valueType: CssValueType = CssValueType.STRING;

    editable: boolean = false;
    smallEditField: boolean = false;

    binding: string = '';
    private preText: string = '';
    private afterText: string = '';

    selectProperties: string[] = [];

    constructor(valueName: string, value?: any, valueType?: CssValueType, editable?: boolean,
        smallEditField?: boolean, binding?: string, preText?: string, afterText?: string) {
        this.valueName = valueName;
        this.value = value ? value : this.value;
        this.valueType = valueType ? valueType : this.valueType;
        this.editable = editable ? editable : this.editable;
        this.smallEditField = smallEditField ? smallEditField : this.smallEditField;
        this.binding = binding ? binding : this.binding;
        this.preText = preText ? preText : this.preText;
        this.afterText = afterText ? afterText : this.afterText;
    }

    getValueCssString() {
        return this.valueName + ': ' + this.preText + this.value + this.afterText + ';';
    }
}

class ValueFactory {
    private static instance: ValueFactory;

    private top = new CssClassValue('top', '', CssValueType.NUMBER, true, true, '', '', 'px');
    private left = new CssClassValue('left', '', CssValueType.NUMBER, true, true, '', '', 'px');
    private heihgt = new CssClassValue('height', '', CssValueType.NUMBER, true, true, '', '', 'px');
    private width = new CssClassValue('width', '', CssValueType.NUMBER, true, true, '', '', 'px');
    private zIndex = new CssClassValue('z-index', '', CssValueType.NUMBER, true, false, '', '', '');

    private borderWidth = new CssClassValue('border-width', '', CssValueType.NUMBER, true, false, '', '', 'px');
    private borderRadius = new CssClassValue('border-radius', '', CssValueType.NUMBER, true, false, '', '', 'px');
    private borderColor = new CssClassValue('border-color', '', CssValueType.COLOR, true, false, '', '', '');
    private borderStyle = new CssClassValue('border-style', '', CssValueType.SELECT, true, false, '', '', '');

    private overflow = new CssClassValue('overflow', '', CssValueType.SELECT, true, false, '', '', '');

    private fontStyle = new CssClassValue('font-style', '', CssValueType.SELECT, true, false, '', '', '');
    private fontVariant = new CssClassValue('font-variant', '', CssValueType.SELECT, true, false, '', '', '');
    private fontWeight = new CssClassValue('font-weight', '', CssValueType.STRING_AND_SELECT, true, false, '', '', '');
    private fontSize = new CssClassValue('font-size', '', CssValueType.NUMBER, true, false, '', '', 'px');
    private fontFamily = new CssClassValue('font-family', '', CssValueType.STRING, true, false, '', '"', '"');
    private textAlign = new CssClassValue('text-align', '', CssValueType.SELECT, true, false, '', '', '');
    private verticalAlign = new CssClassValue('vertical-Align', '', CssValueType.SELECT, true, false, '', '', '');
    private lineHeight = new CssClassValue('line-height', '', CssValueType.NUMBER, true, false, '', '', 'px');
    private textDecoration = new CssClassValue('text-decoration', '', CssValueType.STRING, true, false, '', '', '');

    private backgroundRepeat = new CssClassValue('background-repeat', '', CssValueType.STRING, true, false, '', '', '');
    private backgroundSize = new CssClassValue('background-size', '', CssValueType.STRING, true, false, '', '', '');
    private backgroundPosition = new CssClassValue('background-position', '', CssValueType.STRING, true, false, '', '', '');
    private backgroundImage = new CssClassValue('background-image', '', CssValueType.STRING, true, false, '', 'url(', ')');
    private backgroundColor = new CssClassValue('background-color', '', CssValueType.COLOR, true, false, '', '', '');

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
            this.backgroundPosition, this.backgroundImage, this.backgroundColor, this.cursor]
    }

    public getNewCssClassValue(valueName: string): CssClassValue {
        let newValue = this.defaultValues.find(v => v.valueName === valueName);
        return JSON.parse(JSON.stringify(newValue));
    }
}

export enum CssValueType {
    STRING,
    STRING_AND_SELECT,
    SELECT,
    NUMBER,
    COLOR,
}