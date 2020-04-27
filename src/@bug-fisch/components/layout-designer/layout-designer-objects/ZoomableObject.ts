import { Position } from './Position'

export interface ZoomableObject {
    zoom(factor: number, position: Position): void;
}