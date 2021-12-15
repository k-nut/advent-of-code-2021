const part1 = async (filePath: string) => {
  const text = await Deno.readTextFile(filePath);
  const boardText = text
    .split("\n")
    .filter((line) => line !== "")
    .map((line) => line.split("").map((c) => parseInt(c, 10)));

  type Distances = Record<string, number>;
  const distances: Distances = {};
  for (let y = 0; y < boardText.length; y++) {
    for (let x = 0; x < boardText.length; x++) {
      distances[`${y}-${x}`] = Infinity;
    }
  }

  const getCost = (x: number, y: number) => {
    return boardText[y][x];
  };

  const getCheapestRoute = (
    candidates: Distances,
    visited: Set<string>
  ): [string, number] => {
    let cheapest = Infinity;
    let best: string | null = null;
    for (const [key, value] of Object.entries(candidates)) {
      if (visited.has(key)) {
        continue;
      }
      if (value < cheapest) {
        cheapest = value;
        best = key;
      }
    }
    return [best as string, cheapest];
  };

  distances["0-0"] = 0;

  const visited = new Set<string>();

  const maxSize = boardText.length;
  const updateNeighbors = (position: string, currentCost: number) => {
    const [y, x] = position.split("-").map((c) => parseInt(c, 10));
    if (y < maxSize - 1) {
      const n1 = `${y + 1}-${x}`;
      const p1 = getCost(x, y + 1) + currentCost;
      distances[n1] = distances[n1] >= p1 ? p1 : distances[n1];
    }
    if (x < maxSize - 1) {
      const n2 = `${y}-${x + 1}`;
      const p2 = getCost(x + 1, y) + currentCost;
      distances[n2] = distances[n2] >= p2 ? p2 : distances[n2];
    }
    if (x > 0) {
      const n3 = `${y}-${x - 1}`;
      const p3 = getCost(x - 1, y) + currentCost;
      distances[n3] = distances[n3] >= p3 ? p3 : distances[n3];
    }
    if (y > 0) {
      const n4 = `${y - 1}-${x}`;
      const p4 = getCost(x, y - 1) + currentCost;
      distances[n4] = distances[n4] >= p4 ? p4 : distances[n4];
    }
  };

  while (visited.size < boardText.length * boardText.length) {
    const [current, cost] = getCheapestRoute(distances, visited);
    console.log(visited.size);
    visited.add(current);
    updateNeighbors(current, cost);
  }

  console.log(distances);
};

await part1("./data/15-sample.txt");
await part1("./data/15-sample-custom.txt");
// await part1("./data/15.txt");
