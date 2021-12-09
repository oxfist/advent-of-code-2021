// life support rating = oxygen_generator_rating * c02_scrubber_rating
// filter diagnostic report for a single value (one for each)
// filter using bit criteria:
//  - bit criteria for oxygen_generator_rating:
//    - repeat until only one number is left
//    - start on first bit
//    - filter out numbers keeping the most common number on that position (0 or 1)
//    - if 0 and 1 are equally common, keep the 1
//    - move to bit on the right and repeat

const inputReader = require("../lib/inputReader");

function sumBits(bits, bitCount) {
  return bits.map((bit, i) => bitCount[i] + Number.parseInt(bit));
}

function countBits(bits) {
  // Heads up! 12 bits will only work with the real input data
  let bitCountArray = new Array(12);
  bitCountArray.fill(0);

  for (const number of bits) {
    bitCountArray = sumBits(number.split(""), bitCountArray);
  }

  return bitCountArray;
}

function filterCandidates(candidates, bit, { keep, discard }) {
  if (candidates.length === 1) return candidates;

  let bitCount = countBits(candidates);
  const bitToKeep = bitCount[bit] >= candidates.length / 2 ? keep : discard;

  return candidates.filter((number) => number[bit] === bitToKeep);
}

async function readDiagnostic(reader) {
  let oxygenGeneratorRatingCandidates = [];

  for await (const bits of reader) {
    oxygenGeneratorRatingCandidates.push(bits);
  }

  let c02ScrubberRatingCandidates = oxygenGeneratorRatingCandidates.slice();
  let currentBit = 0;

  while (oxygenGeneratorRatingCandidates.length > 1) {
    oxygenGeneratorRatingCandidates = filterCandidates(
      oxygenGeneratorRatingCandidates,
      currentBit,
      { keep: "1", discard: "0" }
    );

    c02ScrubberRatingCandidates = filterCandidates(
      c02ScrubberRatingCandidates,
      currentBit,
      { keep: "0", discard: "1" }
    );

    currentBit += 1;
  }

  const lifeSupportRating =
    Number.parseInt(oxygenGeneratorRatingCandidates[0], 2) *
    Number.parseInt(c02ScrubberRatingCandidates[0], 2);

  return lifeSupportRating;
}

(async () => {
  const lifeSupportRating = await readDiagnostic(inputReader);
  console.log(lifeSupportRating);
})();
