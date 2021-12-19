const part1 = async (text: string) => {
  const [_, ...numbers] = text.match(
    /target area: x=(-?\d+)..(-?\d+), y=(-?\d+)..(-?\d+)/
  )!;
  const [minX, maxX, minY, maxY] = numbers.map((n) => parseInt(n, 10));

  type ProbeState = {
    xp: number;
    yp: number;
    xv: number;
    yv: number;
  };

  const step = ({ xp, yp, xv, yv }: ProbeState): ProbeState => {
    return {
      xp: xp + xv,
      yp: yp + yv,
      xv: xv === 0 ? 0 : xv < 0 ? xv + 1 : xv - 1,
      yv: yv - 1,
    };
  };

  const matchesBounds = (state: ProbeState) => {
    return (
      state.xp >= minX &&
      state.xp <= maxX &&
      state.yp >= minY &&
      state.yp <= maxY
    );
  };

  const missedAlready = (state: ProbeState) => {
    return state.xp > maxX || state.yp < minY;
  };

  const simulate = (state: ProbeState): number | null => {
    let maxY = 0;
    while (true) {
      if (state.yp > maxY) {
        maxY = state.yp;
      }
      if (matchesBounds(state)) {
        return maxY;
      }
      if (missedAlready(state)) {
        return null;
      }
      state = step(state);
    }
  };

  let best: ProbeState | undefined = undefined;
  let bestHight: number = 0;
  for (let x = 0; x < 10_000; x++) {
    for (let y = 0; y < 10_000; y++) {
      const state = { xp: 0, yp: 0, xv: x, yv: y };
      const result = simulate(state);
      if (result !== null && result > bestHight) {
        bestHight = result;
        best = state;
      }
    }
  }

  console.log(best, bestHight);
};

// await part1("target area: x=20..30, y=-10..-5");
await part1("target area: x=257..286, y=-101..-57");
