const part1 = async (filePath: string) => {
  const text = await Deno.readTextFile(filePath);
  const lines = text.split("\n");
  const counts = lines.reduce((counts, line) => {
    line.split("").forEach((value, index) => {
      counts[index] = {
        ...counts[index],
        [value]: (counts[index]?.[value] || 0) + 1,
      };
    });
    return counts;
  }, {} as Record<number, Record<string, number>>);

  const gamma = Object.values(counts).reduce((result, count) => {
    if (count["0"] > count["1"]) {
      return result + "0";
    }
    return result + "1";
  }, "");

  const epsilon = Object.values(counts).reduce((result, count) => {
    if (count["0"] < count["1"]) {
      return result + "0";
    }
    return result + "1";
  }, "");
  console.log(gamma);
  console.log(parseInt(gamma, 2));
  console.log(epsilon);
  console.log(parseInt(epsilon, 2));
  console.log("result: ", parseInt(gamma, 2) * parseInt(epsilon, 2));
};

await part1("./data/3-sample.txt");
await part1("./data/3-1.txt");
// await part1("./data/2-1.txt");
