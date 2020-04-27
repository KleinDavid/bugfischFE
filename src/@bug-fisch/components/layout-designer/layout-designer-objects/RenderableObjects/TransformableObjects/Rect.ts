import { TransformableObject } from "../TransformableObject";
import { EditField } from '../EditField';

export class Rect extends TransformableObject {
    backgroundColor = '#8a7f8d';
    typeName = 'Rechteck';

    constructor(id: string, editField: EditField) {
        super(id, editField);
        this.editableProperties.concat([]);
    }
}