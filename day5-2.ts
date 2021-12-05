class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return `${this.x}-${this.y}`;
  }
}

class Line {
  start: Point;
  end: Point;

  constructor(start: Point, end: Point) {
    this.start = start;
    this.end = end;
  }

  static fromString(text: string) {
    const [start, end] = text.split(" -> ").map((tuple) => {
      const [x, y] = tuple.split(",").map((s) => parseInt(s, 10));
      return new Point(x, y);
    });
    return new Line(start, end);
  }

  get coordinates() {
    const decrement = (n: number) => n - 1;
    const increment = (n: number) => n + 1;
    const identity = (n: number) => n;

    const getTransform = (start: number, end: number) => {
      if (start < end) {
        return increment;
      }
      if (start > end) {
        return decrement;
      }
      return identity;
    };

    const transformY = getTransform(this.start.y, this.end.y);
    const transformX = getTransform(this.start.x, this.end.x);

    const steps = Math.max(
      Math.abs(this.start.x - this.end.x),
      Math.abs(this.start.y - this.end.y)
    );

    const values = [this.start];
    for (let i = 0; i < steps; i++) {
      const lastPoint = values[values.length - 1];
      const newPoint = new Point(
        transformX(lastPoint.x),
        transformY(lastPoint.y)
      );
      values.push(newPoint);
    }
    return values;
  }
}

const part2 = async (filePath: string) => {
  const text = await Deno.readTextFile(filePath);
  const fileLines = text.split(/\n/);
  const lines = fileLines
    .filter((line) => line !== "")
    .map((fileLine) => Line.fromString(fileLine));

  const counts = lines.reduce((board, line) => {
    line.coordinates.forEach((point) => {
      board[point.toString()] = (board[point.toString()] || 0) + 1;
    });
    return board;
  }, {} as Record<string, number>);

  console.log(Object.values(counts).filter((c) => c >= 2).length);
};

await part2("./data/5-sample.txt");
await part2("./data/5.txt");
