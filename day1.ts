const countIncreases = (numbers: number[]) => {
    const {count} = numbers.slice(1).reduce(({previous, count}, current) => {
        if (current > previous) {
            return {previous: current, count: count + 1}
        }
        return {previous: current, count}

    }, {previous: numbers[0], count: 0});
    return count;
}

const sum = (numbers: number[]) => {
    return numbers.reduce((total, current) => total + current, 0);
}

const countSumIncreases = (numbers: number[]) => {
    const {count} = numbers.slice(3).reduce(({previous, count}, current) => {
        const newWindow = [...previous.slice(1, 3), current];
        const isIncrease = sum(previous) < sum(newWindow);
        return {previous: newWindow, count: isIncrease ? count + 1 : count}

    }, {previous: numbers.slice(0, 3), count: 0});
    return count;
}

const sampleData = `199
200
208
210
200
207
240
269
260
263
    `

const sample1 = async () => {
    const numbers = sampleData.split('\n').map(i => parseInt(i.trim()));
    console.log(countIncreases(numbers))
}

const sample2 = async () => {
    const numbers = sampleData.split('\n').map(i => parseInt(i.trim()));
    console.log(countSumIncreases(numbers))
}

const part1 = async () => {
    const text = await Deno.readTextFile("./data/1-1.txt");
    const numbers = text.split('\n').map(i => parseInt(i.trim()));
    console.log(countIncreases(numbers))
}

const part2 = async () => {
    const text = await Deno.readTextFile("./data/1-1.txt");
    const numbers = text.split('\n').map(i => parseInt(i.trim()));
    console.log(countSumIncreases(numbers))
}

await sample1();
await part1();
await sample2();
await part2();
