export class Position {

    x: number;
    y: number;
  
    constructor(x: number = 0, y: number = 0) {
      this.x = x;
      this.y = y;
    }
  
    updateByDifference(postiton: Position): void {
      this.x += postiton.x;
      this.y += postiton.y;
    }
  
    getDifference(position: Position): Position {
      return new Position(position.x - this.x, position.y - this.y)
    }
  
    transformByPosition(position: Position): void {
      this.x += position.x;
      this.y += position.y
    }
  }