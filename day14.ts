function* stringWindow(text: string, size: number) {
  for (let i = 0; i < text.length - size + 1; i++) {
    yield text.slice(i, i + size);
  }
}

const part1 = async (filePath: string) => {
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

  const performReplacement = (text: string) => {
    const result = [text.slice(0, 1)];
    for (const chars of stringWindow(text, 2)) {
      const newLetter = ruleDict[chars];
      const [first, second] = chars.split("");
      result.push(newLetter, second);
    }
    return result.join("");
  };

  let finalString = template;
  for (let i = 0; i < 10; i++) {
    finalString = performReplacement(finalString);
  }

  const counts = finalString.split("").reduce((counts, char) => {
    return {
      ...counts,
      [char]: (counts[char] | 0) + 1,
    };
  }, {} as Record<string, number>);

  const numbers = Object.values(counts);
  const minCount = Math.min(...numbers);
  const maxCount = Math.max(...numbers);
  console.log(minCount, maxCount);

  console.log(maxCount - minCount);
};

await part1("./data/14-sample.txt");
await part1("./data/14.txt");
