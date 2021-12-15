import heapq
from collections import namedtuple
from itertools import product

Coordinate = namedtuple('Coordinate', ['x', 'y'])


def get_data(filepath):
    with open(filepath) as infile:
        data = infile.readlines()
    return [[int(c) for c in line.strip()] for line in data]


def wrap(number):
    while number > 9:
        number = number % 9
    return number


def grow_map(data):
    map = []
    for row_i in range(0, 5):
        for row in data:
            new_row = []
            for i in range(0, 5):
                new_row += [wrap(value + i + row_i) for value in row]
            map.append(new_row)

    return map


def part2(filepath):
    data = get_data(filepath)

    data = grow_map(data)
    size = len(data) - 1

    def get_neighbors(point):
        [x, y] = point
        new_coords = [[x - 1, y], [x, y - 1], [x + 1, y], [x, y + 1]]
        for x, y in new_coords:
            if 0 <= x <= size and 0 <= y <= size:
                yield Coordinate(x, y), data[y][x]

    # taken from
    # https://bradfieldcs.com/algos/graphs/dijkstras-algorithm/
    def calculate_distances(starting_vertex):
        distances = {Coordinate(t[0], t[1]): float('infinity') for t in product(range(0, len(data)), repeat=2)}
        distances[starting_vertex] = 0

        pq = [(0, starting_vertex)]
        while len(pq) > 0:
            current_distance, current_vertex = heapq.heappop(pq)

            # Nodes can get added to the priority queue multiple times. We only
            # process a vertex the first time we remove it from the priority queue.
            if current_distance > distances[current_vertex]:
                continue

            for neighbor, weight in get_neighbors(current_vertex):
                distance = current_distance + weight

                # Only consider this new path if it's better than any path we've
                # already found.
                if distance < distances[neighbor]:
                    distances[neighbor] = distance
                    heapq.heappush(pq, (distance, neighbor))

        return distances

    d = calculate_distances(Coordinate(0, 0))

    print(d[Coordinate(size, size)])


if __name__ == "__main__":
    # part2("./data/15-sample.txt")
    part2("./data/15.txt")
