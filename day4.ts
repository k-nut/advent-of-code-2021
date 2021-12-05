class Board {
  values: number[][];

  constructor(values: number[][]) {
    this.values = values;
  }

  static fromString(text: string) {
    const values = text
      .trim()
      .split("\n")
      .map((line) =>
        line
          .trim()
          .split(/\s+/)
          .map((char) => parseInt(char, 10))
      );

    return new Board(values);
  }

  matches(numbers: Set<number>): boolean {
    return this.candidates.some((candidate) => {
      return Array.from(candidate).every((number) => numbers.has(number));
    });
  }

  get candidates() {
    const columns = [0, 1, 2, 3, 4].map((i) => [
      this.values[0][i],
      this.values[1][i],
      this.values[2][i],
      this.values[3][i],
      this.values[4][i],
    ]);
    return [...this.values, ...columns].map((row) => new Set(row));
  }
}

const part1 = async (filePath: string) => {
  const text = await Deno.readTextFile(filePath);
  const [numberValues, ...boardValues] = text.split(/^\s*$/gm);
  const boards = boardValues.map((string) => Board.fromString(string));
  const numbers = numberValues.split(",").map((s) => parseInt(s, 10));

  let winner: Board | undefined = undefined;
  let length = 4;
  while (winner === undefined) {
    length += 1;
    winner = boards.find((board) =>
      board.matches(new Set(numbers.slice(0, length)))
    );
  }

  const lastNumber = numbers[length - 1];
  const notCalled = winner.values
    .flat()
    .filter((n) => !numbers.slice(0, length).includes(n));
  const sum = notCalled.reduce((total, n) => total + n, 0);
  console.log("Not Called: ", notCalled);
  console.log("Sum: ", sum);
  console.log("Last number: ", lastNumber);
  console.log(lastNumber * sum);
};

await part1("./data/4-sample.txt");
await part1("./data/4.txt");
