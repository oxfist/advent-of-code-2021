const inputReader = require("../lib/inputReader");

const position = {
  horizontal: 0,
  depth: 0,
};

function updatePosition(position, direction, amount) {
  if (direction === "forward") position.horizontal += amount;
  if (direction === "up") position.depth -= amount;
  if (direction === "down") position.depth += amount;
}

async function readCommands(reader) {
  for await (const line of reader) {
    const [direction, amountString] = line.split(" ");
    const amount = Number.parseInt(amountString);

    updatePosition(position, direction, amount);
  }

  console.log(position.horizontal * position.depth);
}

readCommands(inputReader);
