import { TransformableObject } from "./TransformableObject";

export class IdCard extends TransformableObject {
    borderWidth = 1;
    borderRadius = 12;
    typeName = 'Arbeitsbereich'
  
    editableProperties = ['backgroundColor'];
  }