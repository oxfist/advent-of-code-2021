const inputReader = require("../lib/inputReader");

const submarineData = {
  horizontal: 0,
  depth: 0,
  aim: 0,
};

const COMMANDS = new Map();
COMMANDS.set("down", (num, data) => (data.aim += num));
COMMANDS.set("up", (num, data) => (data.aim -= num));
COMMANDS.set("forward", (num, data) => {
  data.horizontal += num;
  data.depth += data.aim * num;
});

async function readCommands(reader) {
  for await (const line of reader) {
    const [direction, amountString] = line.split(" ");
    const amount = Number.parseInt(amountString);

    COMMANDS.get(direction)(amount, submarineData);
  }

  console.log(submarineData.horizontal * submarineData.depth);
}

readCommands(inputReader);
