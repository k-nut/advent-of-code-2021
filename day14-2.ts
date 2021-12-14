function* stringWindow(text: string, size: number) {
  for (let i = 0; i < text.length - size + 1; i++) {
    yield text.slice(i, i + size);
  }
}

const part2 = async (filePath: string) => {
  const text = await Deno.readTextFile(filePath);
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((line) => line !== "");
  const [template, ...rules] = lines;

  const ruleDict = rules.reduce((dict, rule) => {
    const [key, value] = rule.split(" -> ");
    return {
      ...dict,
      [key]: value,
    };
  }, {} as Record<string, string>);

  const pairs: Record<string, number> = {};
  for (const chars of stringWindow(template, 2)) {
    pairs[chars] = (pairs[chars] || 0) + 1;
  }

  const iterate = (entries: Record<string, number>) => {
    return Object.entries(entries).reduce((newEntries, [chars, count]) => {
      const newLetter = ruleDict[chars];
      const atEnd = `${chars.slice(0, 1)}${newLetter}`;
      const atStart = `${newLetter}${chars.slice(1, 2)}`;
      return {
        ...newEntries,
        [atStart]: (newEntries[atStart] || 0) + count,
        [atEnd]: (newEntries[atEnd] || 0) + count,
      };
    }, {} as Record<string, number>);
  };

  let res = Object.assign({}, pairs);
  for (let i = 0; i < 40; i++) {
    res = iterate(res);
  }

  const counts = Object.entries(res).reduce((counts, [key, value]) => {
    const first = key.slice(0, 1);
    const second = key.slice(1, 2);
    if (first === second) {
      return {
        ...counts,
        [first]: (counts[first] || 0) + value,
      };
    }
    return {
      ...counts,
      [first]: (counts[first] || 0) + value / 2,
      [second]: (counts[second] || 0) + value / 2,
    };
  }, {} as Record<string, number>);
  console.log(counts);
  //
  const numbers = Object.values(counts);
  const minCount = Math.min(...numbers);
  const maxCount = Math.max(...numbers);
  console.log(minCount, maxCount);

  console.log(maxCount - minCount);
  // For the full set of part 2, this needs to be floored, not rounded 🤔
  console.log(Math.round(maxCount - minCount));
};

await part2("./data/14-sample.txt");
await part2("./data/14.txt"); // Not 10002813279338
