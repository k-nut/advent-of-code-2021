type Position = {
    x: number;
    y: number;
}

class Board {
    heights: number[][]

    constructor(heights: number[][]) {
        this.heights = heights;
    }

    static fromString(string: string) {
        const lines = string.split("\n").filter(line => line !== "");

        return new Board(
            lines.map(line => line.split("").map(s => parseInt(s, 10)))
        )
    }

    get lowPoints(): Position[] {
        const lowPoints: Position[] = [];

        for (let y = 0; y < this.heights.length; y++) {
            for (let x = 0; x < this.heights[y].length; x++) {
                const currentValue = this.valueAt(x, y);
                const neighbors = this.neighborsAt(x, y)
                if (neighbors.every(n => currentValue < n)) {
                    lowPoints.push({x, y})
                }
            }
        }
        return lowPoints;
    }

    get gradientPoints(): Position[] {
        const lowPoints: Position[] = [];

        for (let y = 0; y < this.heights.length; y++) {
            for (let x = 0; x < this.heights[y].length; x++) {
                const currentValue = this.valueAt(x, y);
                // From the task:
                // > Locations of height 9 do not count as being in any basin,
                // and all other locations will always be part of exactly one basin.
                if (currentValue < 9){
                    lowPoints.push({x,y})
                }
            }
        }
        return lowPoints;
    }

    get clusterSizes(): number[] {
        let lowPoints = this.lowPoints;
        let gradientPoints = this.gradientPoints;
        const groups: Position[][] = [[lowPoints.shift() as Position]];

        while (gradientPoints.length) {
            const currentGroup = groups[groups.length - 1]
            const neighbors = gradientPoints.filter(newPoint => currentGroup.some(oldPoint => {
                const deltaX = Math.abs(oldPoint.x - newPoint.x);
                const deltaY = Math.abs(oldPoint.y - newPoint.y);
                return (deltaX + deltaY) <= 1
            }));
            if (neighbors.length) {
                groups[groups.length - 1] = [...currentGroup, ...neighbors];
                gradientPoints = gradientPoints.filter(lp => !neighbors.includes(lp));
            } else {
                groups.push([lowPoints.shift() as Position])
            }
        }
        const lengths = groups.map(points => points.length - 1)
        console.log(lengths.join(', '))
        return lengths.sort((a: number, b: number) => a - b).slice(-3)
    }

    valueAt(x: number, y: number) {
        return (this.heights[y] || {})[x]
    }

    neighborsAt(x: number, y: number) {
        return [
            this.valueAt(x, y - 1),
            this.valueAt(x - 1, y),
            this.valueAt(x + 1, y),
            this.valueAt(x, y + 1),
        ].filter(n => n !== undefined)
    }


}

const part1 = async (filePath: string) => {
    const text = await Deno.readTextFile(filePath);
    const board = Board.fromString(text);

    const topSizes = board.clusterSizes;
    console.log(topSizes)
    console.log(topSizes.reduce((p, size) => p * size, 1))

    // console.log(board.lowPoints.reduce((total, point) => total + point + 1, 0))
};


await part1("./data/9-sample.txt");
await part1("./data/9.txt"); // not 1342880
