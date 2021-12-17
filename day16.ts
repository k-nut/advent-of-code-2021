type Bit = 0 | 1;
const decodeIntoBinary = (text: string): [Bit, Bit, Bit, Bit][] => {
  return text.split("").map((c) =>
    parseInt(c, 16)
      .toString(2)
      .padStart(4, "0")
      .split("")
      .map((c) => parseInt(c, 10))
  ) as [Bit, Bit, Bit, Bit][];
};

const popN = (array: Bit[], length: number): [Bit[], Bit[]] => {
  const popped = array.slice(0, length);
  return [popped, array.slice(length)];
};

const popNumber = (values: Bit[], length: number): [number, Bit[]] => {
  const [versionNumbers, rest] = popN(values, length);
  return [parseInt(versionNumbers.join(""), 2), rest];
};

const popLiteral = (array: Bit[]): [Bit[], Bit[], number] => {
  let start: Bit;
  let rest: Bit[];
  let collected: Bit[] = [];
  let totalLength = 0;

  do {
    [[start, ...rest], array] = popN(array, 5);
    totalLength += 5;
    collected.push(...rest);
  } while (start !== 0);
  return [collected, array, totalLength];
};

type Part = {
  type: "literal" | "operation";
  version: number;
  length: number;
  value?: number;
};

const parsePackage = (messageText: Bit[], parts: Part[]): Part[] => {
  let version;
  let typeId;
  let literalArray: Bit[];

  [version, messageText] = popNumber(messageText, 3);
  [typeId, messageText] = popNumber(messageText, 3);
  if (typeId === 4) {
    let partLength;
    [literalArray, messageText, partLength] = popLiteral(messageText);
    return [
      ...parts,
      {
        length: 3 + 3 + partLength,
        type: "literal",
        version: version,
        value: parseInt(literalArray.join(""), 2),
      },
    ];
  }

  // operator packet
  let lengthTypeId;
  [lengthTypeId, messageText] = popNumber(messageText, 1);
  let newParts: Part[] = [];
  if (lengthTypeId === 0) {
    let totalLength;
    [totalLength, messageText] = popNumber(messageText, 15);
    while (
      newParts.reduce((total, part) => total + part.length, 0) < totalLength
    ) {
      newParts = parsePackage(messageText, newParts);
      messageText = messageText.slice(newParts[0]?.length || 0);
      // newParts.reduce((total, part) => total + part.length, 0)
      // );
    }
  } else {
    let subPackagesCount;
    [subPackagesCount, messageText] = popNumber(messageText, 11);
    console.log("spc", subPackagesCount);
    while (newParts.length < subPackagesCount) {
      newParts = parsePackage(messageText, newParts);
      messageText = messageText.slice(newParts[0]?.length || 0);
      console.log(messageText);
    }
    console.log("np2", newParts);
  }
  return [...parts, { length: 3 + 3, type: "operation", version }, ...newParts];
};

const decodeString = (text: string) => {
  const message = decodeIntoBinary(text.trim());
  let messageText = message.flat();

  return parsePackage(messageText, []);
  // console.log(
  //   version,
  //   typeId,
  //   literalArray,
  //   parseInt(literalArray.join(""), 2)
  // );
};

const part1 = async (filePath: string) => {
  const text = await Deno.readTextFile(filePath);
  // let result = decodeString("EE00D40C823060");
  // let result = decodeString("620080001611562C8802118E34");
  let result = decodeString("C0015000016115A2E0802F182340");
  // let result = decodeString("8A004A801A8002F478");
  console.log(result);
  console.log(result.reduce((total, entry) => total + entry.version, 0));
};

await part1("./data/16-sample.txt");
// await part1("./data/15.txt");
