const inputReader = require("../lib/inputReader");

let selectedNumbers = [];
let boards = [];

function isFirstLine(line) {
  return line.indexOf(",") > -1;
}

function getBoardColumns(row, targetColumn) {
  return row[targetColumn];
}

function sumArray(row) {
  let sum = 0;

  row.forEach((numString) => {
    if (numString !== "X") sum += Number.parseInt(numString);
  });

  return sum;
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
      boardData.boardColumns[numPosition][rowNum] = "X";
    }
  });
}

function areAllMarked(row) {
  const isMarked = (number) => number === "X";
  return row.every(isMarked);
}

function isBingo(boardData) {
  for (let i = 0; i < boardData.board.length; i++) {
    if (
      areAllMarked(boardData.board[i]) ||
      areAllMarked(boardData.boardColumns[i])
    ) {
      return true;
    }
  }

  return false;
}

function removeBoardsAtPositions(boards, positions) {
  let newBoards = boards.filter((_, i) => !positions.includes(i));
  return newBoards;
}

async function playBingo(reader) {
  let newBoard = [];
  let boardColumns = [];

  for await (const line of reader) {
    if (line === "") continue;

    if (isFirstLine(line)) {
      selectedNumbers = line.split(",");
      continue;
    }

    newBoard.push(line.trim().split(/\s+/));

    if (newBoard.length === 5) {
      for (let i = 0; i < newBoard.length; i++) {
        boardColumns.push(newBoard.map((row) => getBoardColumns(row, i)));
      }

      const boardData = { board: newBoard, boardColumns: boardColumns };
      boards.push(boardData);
      newBoard = [];
      boardColumns = [];
    }
  }

  let lastWinningBoard = [];
  let lastWinningNumber = -1;

  selectedNumbers.forEach((number) => {
    let boardsPositionsToDelete = [];

    // Mark a single number on each board
    for (let i = 0; i < boards.length; i++) {
      const boardData = boards[i];
      markBoard(boardData, number);

      // At one point the current board wins
      if (isBingo(boardData)) {
        // Save the last winning board
        lastWinningBoard = boardData.board.slice();
        lastWinningNumber = number;

        boardsPositionsToDelete.push(i);
      }
    }

    boards = removeBoardsAtPositions(boards, boardsPositionsToDelete);

    // If no boards are left, the lastWinningBoard is the final last winning board
    if (boards.length === 0) {
      console.log(getScore(lastWinningBoard, lastWinningNumber));
      process.exit(0);
    }

    boardsPositionsToDelete = [];
    // At this point move to the next number
  });
  process.exit(1);
}

(async () => {
  playBingo(inputReader);
})();
