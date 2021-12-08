class Line {
    patterns: string[];
    output: string[]

    constructor(patterns: string[], output: string[]) {
        this.patterns = patterns;
        this.output = output;
    }

    static fromString(input: string) {
        const [patternsString, outputString] = input.split(" | ");
        return new Line(
            patternsString.split(" "),
            outputString.split(" ")
        )
    }
}

const letterMap = {
    "0": "abcefg",
    "1": "cf",
    "2": "acdeg",
    "3": "acdfg",
    "4": "bcdf",
    "5": "abdfg",
    "6": "abdefg",
    "7": "acf",
    "8": "abcdefg",
    "9": "abcdfg",
}

const part1 = async (filePath: string) => {
    const text = await Deno.readTextFile(filePath);
    const fileLines = text.split(/\n/);
    const lines = fileLines
        .filter((line) => line !== "")
        .map((fileLine) => Line.fromString(fileLine))

    const uniqueCount = lines.reduce((count, line) => {
        return count + line.output.filter(output => [
            letterMap["1"].length,
            letterMap["4"].length,
            letterMap["7"].length,
            letterMap["8"].length].includes(output.length)).length
    }, 0)

    console.log(uniqueCount)

};

await part1("./data/8-sample.txt");
await part1("./data/8.txt");
