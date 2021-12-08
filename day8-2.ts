const letterMap = {
    "abcefg": 0,
    "cf": 1,
    "acdeg": 2,
    "acdfg": 3,
    "bcdf": 4,
    "abdfg": 5,
    "abdefg": 6,
    "acf": 7,
    "abcdefg": 8,
    "abcdfg": 9,
}

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

    decode() {
        // The distribution of letters is as follows {a: 8, c: 7, e: 6, d: 8, g: 4, f: 7, b: 9};

        const mapping: Record<string, string> = {};
        const one = this.patterns.find(p => p.length === 2)!.split("")
        const four = this.patterns.find(p => p.length === 4)!.split("")
        const seven = this.patterns.find(p => p.length === 3)!.split("")

        const counts = this.patterns.map(pattern => pattern.split("")).flat().reduce((counts, letter) => {
            return {
                ...counts,
                [letter]: (counts[letter] || 0) + 1
            }
        }, {} as Record<string, number>)
        let pairs = Object.entries(counts);

        mapping["a"] = seven.find(c => !one.includes(c))!;
        pairs = pairs.filter(([letter, count]) => letter !== mapping["a"])

        mapping["c"] = pairs.find(([letter, count]) => count === 8)![0];
        pairs = pairs.filter(([letter, count]) => letter !== mapping["c"])

        mapping["e"] = pairs.find(([letter, count]) => count === 4)![0];
        pairs = pairs.filter(([letter, count]) => letter !== mapping["e"])

        mapping["f"] = pairs.find(([letter, count]) => count === 9)![0];
        pairs = pairs.filter(([letter, count]) => letter !== mapping["f"])

        mapping["b"] = pairs.find(([letter, count]) => count === 6)![0];
        pairs = pairs.filter(([letter, count]) => letter !== mapping["b"])

        mapping["d"] = pairs.find(([letter, count]) => four.includes(letter))![0]
        pairs = pairs.filter(([letter, count]) => letter !== mapping["d"])

        mapping["g"] = pairs[0][0];

        const invertedMap = Object.entries(mapping).reduce((map, [key, value]) => {
            return {
                ...map,
                [value]: key
            }
        }, {} as Record<string, string>);

        const stringResult = this.output.reduce((numberString, pattern) => {
            const converted = pattern.replaceAll(/\w/g, letter => invertedMap[letter]);
            const sorted = converted.split("").sort().join("")
            return numberString + (letterMap as any)[sorted];
        }, "")
        return parseInt(stringResult, 10)
    }
}

const part1 = async (filePath: string) => {
    const text = await Deno.readTextFile(filePath);
    const fileLines = text.split(/\n/);
    const lines = fileLines
        .filter((line) => line !== "")
        .map((fileLine) => Line.fromString(fileLine))
    const total = lines.reduce((total, line)=> {
        return total + line.decode();
    }, 0)
    console.log(total)

};


await part1("./data/8-sample.txt");
await part1("./data/8.txt");
