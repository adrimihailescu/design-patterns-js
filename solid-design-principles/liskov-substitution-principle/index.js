class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
  get area() {
    return this.width * this.height;
  }
  toString() {
    return `${this.width}x${this.height}`;
  }
}

class Square extends Rectangle {
  constructor(size) {
    super(size, size);
  }

  set width(value) {
    this._width = this._height = value;
  }

  set height(value) {
    this._width = this._height = value;
  }
}

let useIt = function (rc) {
  let width = rc._width;
  rc.height = 10;
  console.log(`Expected area of ${10 * width}, ` + `got ${rc.area}`);
};

let rc = new Rectangle(2, 3);
useIt(rc);

let sq = new Square(5);
useIt(sq);
