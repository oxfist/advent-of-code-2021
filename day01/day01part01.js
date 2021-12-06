// Read input file
// Iterate over measurements:
//  - If measurement greater than previous, counter += 1
// Print counter value
//

const fs = require("fs");
const readline = require("readline");

const inputFile = process.argv[2];

const fileStream = fs.createReadStream(inputFile);
const reader = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity,
});

async function readMeasurements(reader) {
  let increasedTimes = 0;
  let lastValue;

  for await (const line of reader) {
    const currentValue = Number.parseInt(line);

    if (currentValue !== undefined && currentValue > lastValue) {
      increasedTimes += 1;
    }

    lastValue = currentValue;
  }

  console.log(increasedTimes);
}

readMeasurements(reader);
