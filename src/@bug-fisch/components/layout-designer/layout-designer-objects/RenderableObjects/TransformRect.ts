import { RenderableObject } from "../RenderableObject";
import { TransformableObject } from './TransformableObject';

export class TransformRect extends RenderableObject {
    type: string;
    typeName: string;
    icon: string;
    zIndex = 1001;
    
    backgroundColor = '#91a3b0';
    
    getCopy(): TransformableObject {
      return null;
    }
  }