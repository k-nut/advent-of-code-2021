class Movement {
  direction: "forward" | "down" | "up";
  distance: number;

  constructor(line: string) {
    const [direciton, distance] = line.split(" ");
    this.direction = direciton as any;
    this.distance = parseInt(distance, 10);
  }

  static fromLines(lines: string) {
    return lines
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line) => new Movement(line));
  }
}

type Position = {
  horizontal: number;
  depth: number;
};

const part1 = async (filePath: string) => {
  const text = await Deno.readTextFile(filePath);
  const movements = Movement.fromLines(text);
  const finalPosition = movements.reduce(
    (position: Position, movement) => {
      switch (movement.direction) {
        case "down":
          return { ...position, depth: position.depth + movement.distance };
        case "up":
          return { ...position, depth: position.depth - movement.distance };
        case "forward":
          return {
            ...position,
            horizontal: position.horizontal + movement.distance,
          };
      }
    },
    { horizontal: 0, depth: 0 }
  );
  console.log(finalPosition);
  console.log(finalPosition.depth * finalPosition.horizontal);
};

await part1("./data/2-sample-1.txt");
await part1("./data/2-1.txt");
