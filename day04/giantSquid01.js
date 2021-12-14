const inputReader = require("../lib/inputReader");

let selectedNumbers = [];
let boards = [];

function isFirstLine(line) {
  return line.indexOf(",") > -1;
}

async function readDiagnostic(reader) {
  let newBoard = [];

  for await (const line of reader) {
    if (line === "") continue;

    if (isFirstLine(line)) {
      selectedNumbers = line.split(",");
      continue;
    }

    newBoard.push(line.trim().split(/\s+/));

    if (newBoard.length === 5) {
      boards.push(newBoard);
      newBoard = [];
    }
  }

  selectedNumbers.forEach((number) => {
    // annotate cards
  });
}

(async () => {
  readDiagnostic(inputReader);
})();
