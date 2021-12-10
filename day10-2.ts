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

    getUnclosed(): string[] {
        const [first, ...characters] = [...this.characters];
        const stack = [first];
        for (const value of characters) {
            if (Object.keys(this.parenMap).includes(value)) {
                stack.push(value);
            } else {
                const top = stack.pop() as string;
                if (this.parenMap[top] !== value) {
                    throw new Error("Found a non-matching parenthesis. This should not happen. Validate the" +
                        "data with `getFirstInvalidCharacter` first.")
                }
            }
        }
        return stack;
    }
}

const calculcateScore = (unClosed: string[]) => {
    const scores: Record<string, number> = {
        "(": 1,
        "[": 2,
        "{": 3,
        "<": 4,
    };

    return unClosed.reverse().reduce((score, character) => {
        return score * 5 + scores[character]
    }, 0)

}

const part2 = async (filePath: string) => {
    const text = await Deno.readTextFile(filePath);
    const lines = text
        .split("\n")
        .filter((l) => l !== "")
        .map((l) => new Line(l));

    const unclosedCharacters = lines
        .filter((l) => l.getFirstInvalidCharacter() === undefined)
        .map(line => line.getUnclosed());

    const scores = unclosedCharacters.map(c => calculcateScore(c)).sort((a: number, b: number) => a - b);
    console.log(scores)

    console.log(scores[(scores.length - 1) / 2])
};

await part2("./data/10-sample.txt");
await part2("./data/10.txt");
