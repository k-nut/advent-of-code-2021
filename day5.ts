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

  isHorizontalOrVertical(): boolean {
    return this.start.x === this.end.x || this.start.y === this.end.y;
  }

  // matches(numbers: Set<number>): boolean {
  //   return this.candidates.some((candidate) => {
  //     return Array.from(candidate).every((number) => numbers.has(number));
  //   });
  // }

  get coordinates() {
    const minX = Math.min(this.end.x, this.start.x);
    const minY = Math.min(this.end.y, this.start.y);
    const maxX = Math.max(this.end.x, this.start.x);
    const maxY = Math.max(this.end.y, this.start.y);

    let values = [];
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        values.push(new Point(x, y));
      }
    }
    return values;
  }
}

const part1 = async (filePath: string) => {
  const text = await Deno.readTextFile(filePath);
  const fileLines = text.split(/\n/);
  const lines = fileLines
    .filter((line) => line !== "")
    .map((fileLine) => Line.fromString(fileLine))
    .filter((line) => line.isHorizontalOrVertical());

  const counts = lines.reduce((board, line) => {
    line.coordinates.forEach((point) => {
      board[point.toString()] = (board[point.toString()] || 0) + 1;
    });
    return board;
  }, {} as Record<string, number>);

  // console.log(counts);

  console.log(Object.values(counts).filter((c) => c >= 2).length);
};

await part1("./data/5-sample.txt");
await part1("./data/5.txt");
