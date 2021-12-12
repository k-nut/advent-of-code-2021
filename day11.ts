import noColor = Deno.noColor;

class Octopus {
  energyLevel: number;

  constructor(energyLevel: number) {
    this.energyLevel = energyLevel;
  }

  increment(): boolean {
    this.energyLevel += 1;
    // If the energy level increases beyond 9, the
    // octopus flashes and triggers its neighbours.
    return this.energyLevel > 9;
  }

  maybeReset(): void {
    // If the energy level increased beyond 9,
    // the octopus flashed and in the next turn
    // its level wil be 0
    if (this.energyLevel > 9) {
      this.energyLevel = 0;
    }
  }
}

class Board {
  octopuses: Octopus[][];
  totalFlashes: number = 0;

  constructor(octopuses: Octopus[][]) {
    this.octopuses = octopuses;
  }

  get size() {
    return this.octopuses.length * this.octopuses[0].length;
  }

  static fromString(string: string) {
    const lines = string.split("\n").filter((line) => line !== "");

    return new Board(
      lines.map((line) =>
        line.split("").map((s) => new Octopus(parseInt(s, 10)))
      )
    );
  }

  octopousAt(x: number, y: number) {
    return (this.octopuses[y] || {})[x];
  }

  async print() {
    for (let y = 0; y < this.octopuses.length; y++) {
      for (let x = 0; x < this.octopuses[y].length; x++) {
        await Deno.stdout.write(
          new TextEncoder().encode(
            `${this.octopousAt(x, y).energyLevel.toString()} `
          )
        );
      }
      console.log("\n");
    }
  }

  neighborCoordinates(x: number, y: number) {
    return [
      [x - 1, y - 1],
      [x - 1, y],
      [x - 1, y + 1],
      [x, y - 1],
      [x, y + 1],
      [x + 1, y - 1],
      [x + 1, y],
      [x + 1, y + 1],
    ];
  }

  triggerFlashAt(x: number, y: number) {
    const octopus = this.octopousAt(x, y);
    if (!octopus || octopus.energyLevel > 9) {
      // there is no octopus here or the
      // octopus flashed already and we cannot flash again
      return;
    }
    const flashed = octopus.increment();
    if (flashed) {
      this.neighborCoordinates(x, y).forEach(([x, y]) =>
        this.triggerFlashAt(x, y)
      );
      this.totalFlashes += 1;
    }
  }

  step() {
    for (let y = 0; y < this.octopuses.length; y++) {
      for (let x = 0; x < this.octopuses[y].length; x++) {
        this.triggerFlashAt(x, y);
      }
    }

    for (let y = 0; y < this.octopuses.length; y++) {
      for (let x = 0; x < this.octopuses[y].length; x++) {
        this.octopousAt(x, y).maybeReset();
      }
    }
  }
}

const part1 = async (filePath: string) => {
  const text = await Deno.readTextFile(filePath);
  const board = Board.fromString(text);

  for (let i = 0; i < 100; i++) {
    console.log("--------");
    board.step();
    await board.print();
  }
  console.log(board.totalFlashes);
};

const part2 = async (filePath: string) => {
  const text = await Deno.readTextFile(filePath);
  const board = Board.fromString(text);

  let lastFlashes = 0;
  for (let i = 0; i < 100000; i++) {
    board.step();
    if (board.totalFlashes - lastFlashes === board.size) {
      console.log(`All flashed at step ${i + 1}`);
      return;
    }
    lastFlashes = board.totalFlashes;
  }
  console.log(board.totalFlashes);
};

// await part1("./data/11-sample-small.txt");
await part1("./data/11-sample.txt");
await part1("./data/11.txt");
await part2("./data/11-sample.txt");
await part2("./data/11.txt");
