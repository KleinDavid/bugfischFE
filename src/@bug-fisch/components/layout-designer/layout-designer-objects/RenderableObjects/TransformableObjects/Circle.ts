import { TransformableObject } from '../TransformableObject';
import { EditField } from '../EditField';

export class Circle extends TransformableObject {
    icon: string = 'radio_button_unchecked';
    type = 'Circle'
    backgroundColor = '#8a7f8d';
    typeName = 'Kreis';
    editableProperties = ['position.x', 'position.y', 'height', 'width', 'borderWidth', 'borderColor', 'backgroundColor']

    constructor(id: string, editField: EditField) {
        super(id, editField);
        this.editableProperties.concat([]);
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
        let copyedObject: Circle = new Circle('', this.editField);
        for (let key in this) {
            if (key !== 'changedSubject') {
                copyedObject[key.toString()] = JSON.parse(JSON.stringify(this[key]));
            }
        }
        return copyedObject;
    }
}