const part1 = async (filePath: string) => {
  const text = await Deno.readTextFile(filePath);
  const vertices: [string, string][] = text
    .split("\n")
    .filter((l) => l !== "")
    .map((l) => l.split("-"))
    .flatMap(([start, end]) => [
      [start, end],
      [end, start],
    ]);

  const isUpperCase = (text: string) => {
    return text.toUpperCase() === text;
  };

  const enumerateRoutes = (
    routes: [string, string][],
    currentRoute: string[],
    allRoutes: any[]
  ): string[] => {
    const currentPosition = currentRoute[currentRoute.length - 1];
    const candidates = routes
      .filter((route) => route[0] === currentPosition)
      .filter(
        (candidate) =>
          isUpperCase(candidate[1]) || !currentRoute.includes(candidate[1])
      );
    if (candidates.length === 0 || currentPosition === "end") {
      return [...allRoutes, currentRoute];
    }
    return candidates.flatMap((candidate) => {
      return [
        ...allRoutes,
        ...enumerateRoutes(routes, [...currentRoute, candidate[1]], allRoutes),
      ];
    });
  };

  const allRoutes = enumerateRoutes(vertices, ["start"], []);
  const endRoutes = allRoutes.filter(
    (route) => route[route.length - 1] === "end"
  );

  console.log(endRoutes.length);
};

await part1("./data/12-sample-small.txt");
await part1("./data/12-sample.txt");
await part1("./data/12-sample-large.txt");
await part1("./data/12.txt");
