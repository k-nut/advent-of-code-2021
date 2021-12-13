const part2 = async (filePath: string) => {
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

  const hasNotVisitedASmallCaveTwice = (route: string[]) => {
    const counts = route
      .filter((stop) => !isUpperCase(stop))
      .reduce((counts, destination) => {
        return {
          ...counts,
          [destination]: (counts[destination] || 0) + 1,
        };
      }, {} as Record<string, number>);
    return !Object.values(counts).some((count) => count >= 2);
  };

  const enumerateRoutes = (
    routes: [string, string][],
    currentRoute: string[],
    allRoutes: any[]
  ): string[][] => {
    const currentPosition = currentRoute[currentRoute.length - 1];
    const candidates = routes
      .filter((route) => route[0] === currentPosition)
      .filter(
        (candidate) =>
          candidate[1] !== "start" &&
          (isUpperCase(candidate[1]) || // this is a big cave
            !currentRoute.includes(candidate[1]) || // we haven't been here yet
            hasNotVisitedASmallCaveTwice(currentRoute)) // we haven't visited any small case multiple times yet
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
  // const allRoutes = enumerateRoutes(
  //   vertices,
  //   ["start", "A", "c", "A", "b", "A"],
  //   []
  // );
  // console.log(allRoutes);
  const endRoutes = allRoutes.filter((route) => {
    return route[route.length - 1] === "end";
  });

  // console.log(endRoutes);
  console.log(endRoutes.length);
};

await part2("./data/12-sample-small.txt");
// await part2("./data/12-sample.txt");
// await part2("./data/12-sample-large.txt");
await part2("./data/12.txt");
