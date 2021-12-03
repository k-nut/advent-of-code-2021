const getMostCommonBit = (lines: string[], index: number) => {
    const [zeroCount, oneCount] = lines.map(line => line.charAt(index))
        .reduce((counts, value) => {
            if (value === "1") {
                return [counts[0], counts[1] + 1]
            }
            return [counts[0] + 1, counts[1]]
        }, [0, 0]);
    return zeroCount > oneCount ? "0" : "1";
}

const part2 = async (filePath: string) => {
    const text = await Deno.readTextFile(filePath);
    const lines = text.split("\n").filter(line => Boolean(line));

    let index = 0;
    let oxygen = [...lines];
    while (oxygen.length > 1) {
        const mostCommon = getMostCommonBit(oxygen, index);
        oxygen = oxygen.filter(line => line.charAt(index) === mostCommon);
        index += 1;
    }

    index = 0;
    let co2 = [...lines];
    do {
        const mostCommon = getMostCommonBit(co2, index);
        // Since there are only two states (0/1) the opposite of the most common must be the least common
        co2 = co2.filter(line => line.charAt(index) !== mostCommon);
        index += 1;
    } while(co2.length > 1)

    console.log(oxygen)
    console.log(co2)

    console.log(parseInt(oxygen[0], 2) * parseInt(co2[0], 2))
};

await part2("./data/3-sample.txt");
await part2("./data/3-1.txt");
