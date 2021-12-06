const fs = require("fs");
const readline = require("readline");

const inputFile = process.argv[2];

const fileStream =
  inputFile !== undefined ? fs.createReadStream(inputFile) : process.stdin;

const reader = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity,
});

module.exports = reader;
