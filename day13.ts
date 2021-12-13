class Matrix {
  values: ("." | "#")[][];

  constructor(values: ("." | "#")[][]) {
    this.values = values;
  }

  static fromStringArray(text: string[]) {
    const coordinates = text.map((line) =>
      line.split(",").map((c) => parseInt(c, 10))
    );
    const maxX = Math.max(...coordinates.map((c) => c[0])) + 1;
    const maxY = Math.max(...coordinates.map((c) => c[1])) + 1;

    const values = Array(maxY)
      .fill(1)
      .map((i) => new Array(maxX).fill("."));

    coordinates.forEach(([x, y]) => {
      values[y][x] = "#";
    });

    return new Matrix(values);
  }

  print() {
    for (let y = 0; y < this.values.length; y++) {
      console.log(this.values[y].join(""));
    }
  }

  foldAtY(y: number) {
    const [top, bottom] = splitAt(this.values, y);
    const flipped = bottom.reverse();

    const newBoard = top.map((row, yIndex) =>
      row.map((topValue, xIndex) => {
        const bottomValue = flipped[yIndex][xIndex];
        return topValue === "#" || bottomValue === "#" ? "#" : ".";
      })
    );
    this.values = newBoard;
  }

  foldAtX(x: number) {
    const newBoard = this.values.map((row, yIndex) => {
      const [left, right] = splitAt(row, x);
      const flipped = right.reverse();
      return left.map((leftValue, xIndex) => {
        const rightValue = flipped[xIndex];
        return leftValue === "#" || rightValue === "#" ? "#" : ".";
      });
    });
    this.values = newBoard;
  }

  foldAt(dimension: "x" | "y", position: number) {
    if (dimension === "x") {
      this.foldAtX(position);
    } else {
      this.foldAtY(position);
    }
  }
}

function splitAt<T>(array: T[], index: number): [T[], T[]] {
  const part1 = array.slice(0, index);
  const part2 = array.slice(index + 1, array.length);
  return [part1, part2];
}

const part1And2 = async (filePath: string) => {
  const text = await Deno.readTextFile(filePath);
  const lines = text.split("\n").map((l) => l.trim());
  const separator = lines.indexOf("");
  const [dots, instructions] = splitAt(lines, separator);

  const parsedInstructions = instructions
    .filter((i) => i !== "")
    .map((instruction) => {
      const [_, dimension, count] = instruction.match(/(\w)=(\d+)/)!;
      return [dimension, parseInt(count, 10)];
    });

  const m = Matrix.fromStringArray(dots);
  const first = parsedInstructions[0];
  m.foldAt(first[0] as any, first[1] as any);

  const dotCount = m.values.flat().filter((s) => s === "#").length;
  console.log(dotCount);

  parsedInstructions.slice(1).forEach(([dimension, position]) => {
    m.foldAt(dimension as any, position as number);
  });

  m.print();
};

await part1And2("./data/13-sample.txt");
await part1And2("./data/13.txt");
