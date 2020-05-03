import { TransformableObject } from '../TransformableObject';
import { Position } from '../../Position';

export class Circle extends TransformableObject {
    icon: string = 'radio_button_unchecked';
    type = 'Circle'
    backgroundColor = '#8a7f8d';
    typeName = 'Kreis';
    editableProperties = ['position.x', 'position.y', 'height', 'width', 'borderWidth', 'borderColor', 'backgroundColor'];

    private svgElementRef: SVGElement;
    private ellipseElementRef: SVGElement;

    constructor(id: string) {
        super(id);
        this.editableProperties.concat([]);
    }

    create(): void {
        this.htmlElementRef = document.createElement('div');
        this.htmlElementRef.id = this.id;

        this.svgElementRef = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.ellipseElementRef = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');

        this.svgElementRef.appendChild(this.ellipseElementRef);
        this.htmlElementRef.appendChild(this.svgElementRef);

        document.getElementById(this.parent.id).appendChild(this.htmlElementRef);
        this.render();
    }

    render(): void {
        this.htmlElementRef.style.position = 'absolute';

        this.htmlElementRef.style.height = (this.height + this.borderWidth * 2) + 'px';
        this.htmlElementRef.style.width = (this.width + this.borderWidth * 2) + 'px';
        this.htmlElementRef.style.top = this.position.y + 'px';
        this.htmlElementRef.style.left = this.position.x + 'px';
        this.htmlElementRef.style.zIndex = this.zIndex + '';

        this.htmlElementRef.style.cursor = this.cursor;
        this.htmlElementRef.id = this.id;

        this.svgElementRef.setAttribute('height', (this.height + this.borderWidth * 2) + 'px');
        this.svgElementRef.setAttribute('width', (this.width + this.borderWidth * 2) + 'px');
        this.svgElementRef.style.height = (this.height + this.borderWidth * 2) + 'px';
        this.svgElementRef.style.width = (this.width + this.borderWidth * 2) + 'px';
        this.svgElementRef.style.position = 'relative';

        this.ellipseElementRef.setAttribute('rx', ((this.width) / 2) + 'px');
        this.ellipseElementRef.setAttribute('ry', ((this.height) / 2) + 'px');
        this.ellipseElementRef.setAttribute('cx', ((this.width + this.borderWidth * 2) / 2) + 'px');
        this.ellipseElementRef.setAttribute('cy', ((this.height + this.borderWidth * 2) / 2) + 'px');
        this.ellipseElementRef.style.fill = this.backgroundColor;
        this.ellipseElementRef.style.stroke = this.borderColor;
        this.ellipseElementRef.style.strokeWidth = this.borderWidth + 'px';

        //this.svgElementRef.appendChild(this.ellipseElementRef);
        //this.htmlElementRef.appendChild(this.svgElementRef);
       //  this.htmlElementRef.outerHTML = this.getHTML();
    }

    transform(position: Position) {
        super.transform(position);
        this.render();
    }

    getHTML(): string {
        let div = document.createElement('div');

        div.style.position = 'absolute';

        div.style.height = (this.height + this.borderWidth * 2) + 'px';
        div.style.width = (this.width + this.borderWidth * 2) + 'px';
        div.style.top = this.position.y + 'px';
        div.style.left = this.position.x + 'px';
        div.style.zIndex = this.zIndex + '';

        div.style.cursor = this.cursor;
        div.id = this.id;

        let svg = document.createElement('svg');

        svg.setAttribute('height', (this.height + this.borderWidth * 2) + 'px');
        svg.setAttribute('width', (this.width + this.borderWidth * 2) + 'px');

        let ellipse = document.createElement('ellipse');
        ellipse.setAttribute('rx', ((this.width) / 2) + 'px');
        ellipse.setAttribute('ry', ((this.height) / 2) + 'px');
        ellipse.setAttribute('cx', ((this.width + this.borderWidth * 2) / 2) + 'px');
        ellipse.setAttribute('cy', ((this.height + this.borderWidth * 2) / 2) + 'px');
        ellipse.style.fill = this.backgroundColor;
        ellipse.style.stroke = this.borderColor;
        ellipse.style.strokeWidth = this.borderWidth + 'px';

        svg.appendChild(ellipse);
        div.appendChild(svg);

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

    getCopy(): Circle {
        let copyedObject: Circle = new Circle('');
        for (let key in this) {
            if (key !== 'changedSubject') {
                copyedObject[key.toString()] = JSON.parse(JSON.stringify(this[key]));
            }
        }
        return copyedObject;
    }
}