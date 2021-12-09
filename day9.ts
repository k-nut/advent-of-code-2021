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

    get lowPoints(): number[] {
        const lowPoints: number[] = [];

        for (let y = 0; y < this.heights.length; y++){
            for (let x = 0; x < this.heights[y].length; x++){
                const currentValue = this.valueAt(x, y);
                const neighbors = this.neighborsAt(x, y)
                if (neighbors.every(n => currentValue < n)){
                    lowPoints.push(currentValue)
                }
            }
        }
        return lowPoints;
    }

    valueAt(x: number, y:number){
        return (this.heights[y] || {})[x]
    }

    neighborsAt(x: number, y :number){
        return [
            this.valueAt(x, y-1),
            this.valueAt(x-1, y),
            this.valueAt(x+1, y),
            this.valueAt(x, y+1),
        ].filter(n => n !== undefined)
    }



}

const part1 = async (filePath: string) => {
    const text = await Deno.readTextFile(filePath);
    const board = Board.fromString(text);
    console.log(board.lowPoints)

    console.log(board.lowPoints.reduce((total, point) => total + point + 1, 0))
};


await part1("./data/9-sample.txt");
await part1("./data/9.txt");
