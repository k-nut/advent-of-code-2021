class Line {
  characters: string[];

  parenMap: Record<string, string> = {
    "(": ")",
    "[": "]",
    "{": "}",
    "<": ">",
  } as const;

  constructor(string: string) {
    this.characters = string.split("");
  }

  getFirstInvalidCharacter(): string | undefined {
    const [first, ...characters] = [...this.characters];
    const stack = [first];
    for (const value of characters) {
      if (Object.keys(this.parenMap).includes(value)) {
        stack.push(value);
      } else {
        const top = stack.pop() as string;
        if (this.parenMap[top] !== value) {
          return value;
        }
      }
    }
    return undefined;
  }
}

const part1 = async (filePath: string) => {
  const text = await Deno.readTextFile(filePath);
  const lines = text
    .split("\n")
    .filter((l) => l !== "")
    .map((l) => new Line(l));

  const scores: Record<string, number> = {
    ")": 3,
    "]": 57,
    "}": 1197,
    ">": 25137,
  };
  const inValidCharacters = lines
    .map((l) => l.getFirstInvalidCharacter())
    .filter((c) => c !== undefined);

  const score = inValidCharacters.reduce(
    (total, c) => total + scores[c as string],
    0
  );
  console.log(score);
};

await part1("./data/10-sample.txt");
await part1("./data/10.txt");
