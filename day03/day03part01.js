const inputReader = require("../lib/inputReader");

let bitCountArray = new Array(12);
bitCountArray.fill(0);

const onOrOff = (bit, halfLineAmount) =>
  Number.parseInt(bit) > halfLineAmount / 2 ? "1" : "0";
const toDecimal = (bits) => Number.parseInt(bits, 2);

// Function from https://stackoverflow.com/a/42450649/2252927
function flipBits(number, digitCount) {
  return ~number & (Math.pow(2, digitCount) - 1);
}

function sumBits(bits, bitCount) {
  return bits.map((bit, i) => bitCount[i] + Number.parseInt(bit));
}

async function readDiagnostics(reader) {
  let lineCount = 0;

  for await (const bits of reader) {
    bitCountArray = sumBits(bits.split(""), bitCountArray);
    lineCount += 1;
  }

  const mostCommonBitsArray = bitCountArray
    .map((bit) => onOrOff(bit, lineCount))
    .join("");

  const gammaRate = toDecimal(mostCommonBitsArray);
  const epsilonRate = flipBits(gammaRate, mostCommonBitsArray.length);

  return gammaRate * epsilonRate;
}

(async () => {
  const powerConsumption = await readDiagnostics(inputReader);
  console.log(powerConsumption);
})();
