const inputReader = require("../lib/inputReader");

let selectedNumbers = [];
let boards = [];

function isFirstLine(line) {
  return line.indexOf(",") > -1;
}

function getBoardColumns(row, targetColumn) {
  return row[targetColumn];
}

function getBoardSum(board) {
  let sum = 0;
  board.forEach((row) => {
    sum += sumArray(row);
  });
  return sum;
}

function getScore(board, num) {
  return getBoardSum(board) * num;
}

function markBoard(boardData, num) {
  boardData.board.forEach((row, rowNum) => {
    const numPosition = row.indexOf(num);

    if (numPosition != -1) {
      row[numPosition] = "X";
      boardData.boardRows[numPosition][rowNum] = "X";
    }
  });
}

function sumArray(row) {
  let sum = 0;

  row.forEach((numString) => {
    if (numString !== "X") sum += Number.parseInt(numString);
  });

  return sum;
}

function isBingo(boardData) {
  for (let i = 0; i < boardData.board.length; i++) {
    if (
      sumArray(boardData.board[i]) === 0 ||
      sumArray(boardData.boardRows[i]) === 0
    ) {
      return true;
    }
  }

  return false;
}

async function playBingo(reader) {
  let newBoard = [];
  let boardRows = [];

  for await (const line of reader) {
    if (line === "") continue;

    if (isFirstLine(line)) {
      selectedNumbers = line.split(",");
      continue;
    }

    newBoard.push(line.trim().split(/\s+/));

    if (newBoard.length === 5) {
      for (let i = 0; i < newBoard.length; i++) {
        boardRows.push(newBoard.map((row) => getBoardColumns(row, i)));
      }

      const boardData = { board: newBoard, boardRows: boardRows };
      boards.push(boardData);
      newBoard = [];
      boardRows = [];
    }
  }

  selectedNumbers.forEach((number) => {
    boards.forEach((boardData) => {
      markBoard(boardData, number);

      if (isBingo(boardData)) {
        console.log(getScore(boardData.board, number));
        process.exit(0);
      }
    });
  });
  process.exit(1);
}

(async () => {
  playBingo(inputReader);
})();
