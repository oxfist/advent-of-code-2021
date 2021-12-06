const fs = require("fs");
const readline = require("readline");

const inputFile = process.argv[2];

const fileStream =
  inputFile !== undefined ? fs.createReadStream(inputFile) : process.stdin;

const reader = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity,
});

let windowIncreasedAmount = 0;

function sumOf(win) {
  return win.reduce((prev, measurement) => prev + measurement, 0);
}

function fullWindows(currentWindow, newWindow) {
  return (
    currentWindow.length === newWindow.length && currentWindow.length === 3
  );
}

async function readMeasurements(reader) {
  let currentWindow = [];
  let newWindow = [];

  const updateWindows = function (value, currentWindow, newWindow) {
    const newCurrentWindow = currentWindow.slice();
    const newNewWindow = newWindow.slice();

    newCurrentWindow.push(value);

    if (newCurrentWindow.length >= 2) newNewWindow.push(value);
    if (newCurrentWindow.length === 4) newCurrentWindow.pop();

    return {
      currentWindow: newCurrentWindow,
      newWindow: newNewWindow,
    };
  };

  for await (const line of reader) {
    const currentValue = Number.parseInt(line);

    // - push new number
    // - if window measurement increased, counter += 1
    // - update values

    const updatedWindows = updateWindows(
      currentValue,
      currentWindow,
      newWindow
    );

    if (fullWindows(updatedWindows.currentWindow, updatedWindows.newWindow)) {
      if (
        sumOf(updatedWindows.newWindow) > sumOf(updatedWindows.currentWindow)
      ) {
        windowIncreasedAmount += 1;
      }
      currentWindow = updatedWindows.newWindow;
      newWindow = updatedWindows.newWindow.slice(1);
    } else {
      currentWindow = updatedWindows.currentWindow;
      newWindow = updatedWindows.newWindow;
    }
  }

  console.log(windowIncreasedAmount);
}

readMeasurements(reader);
