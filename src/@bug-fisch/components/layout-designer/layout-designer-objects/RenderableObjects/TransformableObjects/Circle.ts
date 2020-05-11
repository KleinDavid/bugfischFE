import { TransformableObject } from '../TransformableObject';
import { Position } from '../../Position';
import { CssClass } from '../../CssClass';

export class Circle extends TransformableObject {
    icon: string = 'radio_button_unchecked';
    type = 'Circle'
    typeName = 'Kreis';

    cssClassStyleProperties = [
        { valueName: 'position', value: 'absolute' },
        { valueName: 'cursor', value: 'move' }
    ];

    cssClassEllipseStyleProperties = [
        { valueName: 'fill', value: '#8a7f8d' },
        { valueName: 'stroke', value: 'black' },
        { valueName: 'stroke-width', value: '0' }
    ]

    private strokeWidht: number = 0;

    private svgElementRef: SVGElement;
    private ellipseElementRef: SVGElement;

    constructor(id: string) {
        super(id);
        this.htmlElementRef = document.createElement('div');
        this.htmlElementRef.id = this.id;
        this.cssClassList.forEach(c => {
            this.htmlElementRef.classList.add(c.name);
        });

        this.svgElementRef = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.ellipseElementRef = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');

        this.svgElementRef.appendChild(this.ellipseElementRef);
        this.htmlElementRef.appendChild(this.svgElementRef);

        this.cssClassPosition = new CssClass(this.type + '-' + this.id + '-position');
        this.htmlElementRef.classList.add(this.cssClassPosition.name);
        this.svgElementRef.classList.add(this.cssClassPosition.name);

        let standardValuesClass = new CssClass(this.type + '-' + this.id + '-style');
        standardValuesClass.setValuesByList(this.cssClassStyleProperties);
        this.cssClassList.push(standardValuesClass)
        this.htmlElementRef.classList.add(standardValuesClass.name);

        let styleClass = new CssClass(this.type + '-' + this.id + '-ellipse');
        styleClass.menuRightEditable = true;
        styleClass.setValuesByList(this.cssClassEllipseStyleProperties);
        this.cssClassList.push(styleClass)
        this.ellipseElementRef.classList.add(styleClass.name);
    }

    create(): void {
        this.cssClassPosition.create();
        this.cssClassList.forEach(c => c.create());

        document.getElementById(this.parent.id).appendChild(this.htmlElementRef);
        this.render();
    }

    render(): void {
        this.ellipseElementRef.setAttribute('rx', ((this.width - this.strokeWidht) / 2) + 'px');
        this.ellipseElementRef.setAttribute('ry', ((this.height - this.strokeWidht) / 2) + 'px');
        this.ellipseElementRef.setAttribute('cx', ((this.width + this.borderWidth * 2) / 2) + 'px');
        this.ellipseElementRef.setAttribute('cy', ((this.height + this.borderWidth * 2) / 2) + 'px');

        let values = [
            { valueName: 'left', value: this.position.x + '' },
            { valueName: 'top', value: this.position.y + '' },
            { valueName: 'width', value: this.width + '' },
            { valueName: 'height', value: this.height + '' },
            { valueName: 'z-index', value: this.zIndex + '' },

        ];
        this.cssClassPosition.setValuesByList(values);
        this.createTransformRects();
    }

    transform(position: Position) {
        super.transform(position);
        this.render();
    }

    getCopy(): Circle {
        let copyedObject: Circle = new Circle('');
        for (let key in this) {
            if (key !== 'changedSubject' && key !== 'transformRects' && key !== 'parent') {
                copyedObject[key.toString()] = JSON.parse(JSON.stringify(this[key]));
            }
        }
        let c = new Circle('')
        return Object.assign(c, copyedObject);
    }

    setCssValue(valueName: string, value: string): void {
        if (valueName === 'stroke-width') {
            let difference = parseInt(value) - this.strokeWidht;
            this.strokeWidht = parseInt(value);
            this.width += difference * 2;
            this.height += difference * 2;
            this.render();
        }
        super.setCssValue(valueName, value);
    }
}