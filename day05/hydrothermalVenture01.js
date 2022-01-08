const inputReader = require("../lib/inputReader");

/*
 * BASE INFO
 * - x1,y1 -> x2,y2 is a vent line
 * - only horizontal and vertical lines => x1 = x2 or y1 = y2
 * - points are inclusive
 * - grid origin (0, 0) is at top left
 */

/*
 * BASE ALGORITHM
 * 1. read all points - check
 * 2. find max_x
 * 3. find max_y
 * 4. build grid of size max_x * max_y
 * 5. foreach point
 *    5.1 add line to grid (increase positions included in the line)
 * 6. find amount of points where 2 or more lines overlap
 *    - foreach row of grid, count numbers that are >= 2
 *    - add to sum the amount of numbers
 * 7. return sum of numbers >= 2
 */

var _ = require("lodash");

const X_COORDINATE = "x";
const Y_COORDINATE = "y";

function findMax(points, coordinate) {
  return _.max(
    Object.values(
      _.maxBy(points, (point) => {
        return _.max([point[`${coordinate}1`], point[`${coordinate}2`]]);
      })
    )
  );
}

function buildGrid(width, height) {
  const newGrid = [];

  for (let i = 0; i < width; i += 1) {
    const newRow = [];

    for (let j = 0; j < height; j += 1) {
      newRow.push(0);
    }

    newGrid.push(newRow);
  }

  return newGrid;
}

async function readVentLines(reader) {
  const points = [];

  for await (const line of reader) {
    const [p1, p2] = line.split(" -> ");
    const [x1, y1] = p1.split(",").map(Number);
    const [x2, y2] = p2.split(",").map(Number);

    points.push({ x1, y1, x2, y2 });
  }

  const max_x = findMax(points, X_COORDINATE);
  const max_y = findMax(points, Y_COORDINATE);

  const grid = buildGrid(max_x, max_y);
}

(async () => {
  readVentLines(inputReader);
})();
