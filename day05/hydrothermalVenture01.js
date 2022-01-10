/*
 * BASE INFO
 * - x1,y1 -> x2,y2 is a vent line
 * - only horizontal and vertical lines => x1 = x2 or y1 = y2
 * - points are inclusive
 * - grid origin (0, 0) is at top left
 */

var _ = require("lodash");
const inputReader = require("../lib/inputReader");

const X_COORDINATE = "x";
const Y_COORDINATE = "y";

function findMax(lines, coordinate) {
  return _.max(
    Object.values(
      _.maxBy(lines, (line) => {
        return _.max([line[`${coordinate}1`], line[`${coordinate}2`]]);
      })
    )
  );
}

/*
 * Grid display
 *
 *  2,  2 -> 2,  1
 * (x1, y1) (x2, y2)
 *
 * (0,0)
 *   .......1..
 *   ..1....1..
 *   ..1....1..
 *   .......1..
 *   .112111211
 *   ..........
 *   ..........
 *   ..........
 *   ..........
 *   222111....
 *          (9,9)
 *
 */

function buildGrid(width, height) {
  const newGrid = [];

  for (let i = 0; i <= width; i += 1) {
    const newRow = [];

    for (let j = 0; j <= height; j += 1) {
      newRow.push(0);
    }

    newGrid.push(newRow);
  }

  return newGrid;
}

function addLine(grid, line) {
  const start = (...arr) => _.min(arr);
  const end = (...arr) => _.max(arr);

  // Go from start to end adding 1 to each position in the line
  if (line.x1 === line.x2) {
    /* Vertical line */

    const first = start(line.y1, line.y2);
    const last = end(line.y1, line.y2);

    for (let i = first; i <= last; i += 1) {
      grid[line.x1][i] += 1;
    }
  } else if (line.y1 === line.y2) {
    /* Horizontal line */

    const first = start(line.x1, line.x2);
    const last = end(line.x1, line.x2);

    for (let i = first; i <= last; i += 1) {
      grid[i][line.y1] += 1;
    }
  } else {
    // throw new TypeError(
    //   `Invalid line data (${Object.values(
    //     line
    //   )}): either x1 = x2 or y1 = y2 should be true`,
    //   "hydrothermalVenture01.js",
    //   50
    // );
  }
}

function addLines(grid, lines) {
  _.forEach(lines, (line) => {
    addLine(grid, line);
  });
}

function printGrid(grid) {
  const transposeGrid = (grid) => {
    return grid[0].map((_, colIndex) => grid.map((row) => row[colIndex]));
  };

  _.forEach(transposeGrid(grid), (row) => {
    console.log(row.join("").replaceAll("0", "."));
  });
}

function countOverlappingPoints(grid) {
  // Reduce grid to the sum of all numbers >= 2
  return _.reduce(
    grid,
    (sum, row) => {
      return _.filter(row, (num) => num >= 2).length + sum;
    },
    0
  );
}

async function readVentLines(reader) {
  const lines = [];
  let overlappingPointsCount;
  let max_x;
  let max_y;
  let grid;

  for await (const line of reader) {
    const [p1, p2] = line.split(" -> ");
    const [x1, y1] = p1.split(",").map(Number);
    const [x2, y2] = p2.split(",").map(Number);

    lines.push({ x1, y1, x2, y2 });
  }

  max_x = findMax(lines, X_COORDINATE);
  max_y = findMax(lines, Y_COORDINATE);

  grid = buildGrid(max_x, max_y);

  addLines(grid, lines);

  overlappingPointsCount = countOverlappingPoints(grid);

  console.log(overlappingPointsCount);
}

/*
 * BASE ALGORITHM
 * 1. read all points - ready
 * 2. find max_x - ready
 * 3. find max_y - ready
 * 4. build grid of size max_x * max_y - ready
 * 5. foreach point - ready
 *    5.1 add line to grid (increase positions included in the line)
 * 6. find amount of points where 2 or more lines overlap - ready
 *    - foreach row of grid, count numbers that are >= 2
 *    - add to sum the amount of numbers
 * 7. return sum computed in step 6
 *
 */

(async () => {
  readVentLines(inputReader);
})();
