// IDEAS:
// Allow users to change the max counter value (so they can increase the difficulty)

const difficulties = ["Normal", "Elite", "Nightmare", "Any"];

const characters = ["Ao Bai", "Crown Prince", "Qing Yan", "Lei Luo", "Any Character"];

// [challenge, resample weight, chance weight]
// Any challenge with a resample weight of 1 will stop sampling after it is picked
// Increasing the chance weight by 1 increases the chance it will be selected to n+1/total+1
// So if it's 1->2 in a list of 43, all initially at 1, the chance will go from 1/43 to 2/44
// Bear in mind this means that increasing the chance of one, DECREASES the chances of all others by dilution
const challenges = [
  ["Normal Run", 1, 1],
  ["Speedrun", 0.4, 1],
  ["No Dash", 0.5, 1],
  ["No Sound", 0.5, 1],
  ["No Craftsman", 0.3, 1],
  ["No Kermit", 0.3, 1],
  ["No Vaults", 0.3, 1],
  ["All Vaults", 0.1, 1],
  ["No Cursed Chests", 0.3, 1],
  ["All Cursed Chests", 0.3, 1],
  ["No Secondary Skills", 0.3, 1],
  ["No Primary Skills", 0.3, 1],
  ["No Scrolls", 1, 1],
  ["No Acensions", 1, 1],
  ["No Revive", 0.3, 1],
  ["No Manual Reloads", 0.2, 1],
  ["No Elemental Weapons", 0.2, 1],
  ["No Insurance: Try not to break anything", 0.2, 1],
  ["Butterfingers: Always pick up new weapons", 0.2, 1],
  ["Sticky Fingers: Never pick up new weapons", 0.2, 1],
  ["Rebind Hell: Invert Movement Bindings", 1, 1],
  ["Pimm's Curse: Invert mouse buttons, axis, & movement", 1, 1],
  // ["NES Mode: Lowest Resolution", 1], // Sadly this seems to fuck with people's stream setups...which sucks
  ["Kap's Curse: SWORD CAT!", 1, 1],
  ["Foundry Only", 0.5, 5],
  ["Pistols", 0.5, 5],
  ["Submachineguns", 0.3, 5],
  ["Rifles", 0.3, 5],
  ["Shotguns", 0.3, 5],
  ["Snipers", 0.3, 5],
  ["Launchers", 0.3, 5],
  ["Injectors", 0.3, 5],
  ["Melee", 0.3, 2],
  ["Only Fire Weapons", 0.3, 4],
  ["Only Corrosion Weapons", 0.3, 4],
  ["Only Lightning Weapons", 0.3, 4],
  ["Student Loan: Spend money ASAP", 0.5, 1],
  ["No Gemini", 0.1, 1],
  ["OGemini: No reforging", 0.1, 1],
  ["NoUI: Press F10 to play without UI", 0.7, 1],
  ["Backwards movement only", 0.4, 1],
  // ["Only Turn Left", 0.5],
  // ["Only Turn Right", 0.5],
  ["Switch mouse buttons", 0.5, 1],
  ["Change Language", 0.6, 1],
  ["Use a controller", 0.4, 1],
];

// Why in the name of all that is holy do I need to write fisher-yates again just to shuffle an array?
function shuffle(array) {
  let curridx = array.length,  randidx;
  while (0 !== curridx) {
    randidx = Math.floor(Math.random() * curridx);
    curridx--;
    [array[curridx], array[randidx]] = [
      array[randidx], array[curridx]];
  }
  return array;
}

function createWeightedIdxArray(challengeArray) {
  // Calculate total length of array
  console.log("Creating Weighted Index Array");
  // const reducer = (accumulator, currentValue) => accumulator + currentValue[2];
  // let arrayLength = challengearray.reduce(reducer, 0)
  let i;
  let outarray = [];
  for (i = 0; i < challengeArray.length; i++) {
    outarray = outarray.concat(Array(parseInt(challengeArray[i][2])).fill(i));
  }
  const weightedChallengeIdxs = outarray;
  // console.log(weightedChallengeIdxs);
  return outarray;
}

const weightedChallengeIdxs = createWeightedIdxArray(challenges)  // Create weightedChallengeIdxs in module scope

function findResampleMax(challengeArray) {
  // Find the maximum difficulty value currently allowed by the generator
  const reducer = (accumulator, currentValue) => accumulator + currentValue[1];
  return challengeArray.reduce(reducer, 0)
}

const resampleMax = findResampleMax(challenges) * 0.9  // Allow a bit of headroom just in case

function removeItem(array, item) {
  return array.filter(i => i !== item);
}

function generateRun(challengeDifficulty) {
  // console.log("Generating new run...")

  // Check whether the supplied difficulty is a positive number
  if (isNaN(challengeDifficulty) || challengeDifficulty <= 0) {
    challengeDifficulty = 1
  }

  // Check whether the supplied difficulty is greater than the max the generator could generate
  if (challengeDifficulty > resampleMax) {
    challengeDifficulty = resampleMax
  }
  // console.log(challengeDifficulty)

  // let outstr = ""
  let difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
  // console.log(difficulty)
  let character = characters[Math.floor(Math.random() * characters.length)];
  // console.log(character)

  let challenge_list = [];
  // JS is not python! deepcopies are hard and don't necessarily happen when you think they do
  // Converting to and from JSON forces a copy and prevents the weightedChallengeIdxs array from being exhausted
  let challengeIdxs = shuffle(JSON.parse(JSON.stringify(weightedChallengeIdxs)));
  // We need to shuffle the array because js arrays do not have a pop command that will take an index to pop.
  // I'm sure all this would be a lot easier if I just learned node.js but that feels ludicrous!


  let counter = 0;
  let randfloat = 1;  // This will eventually be definable via the UI
  while (counter < randfloat) {
    let challengeIdx = challengeIdxs.pop(); // Get next challenge index
    challengeIdxs = removeItem(challengeIdxs, challengeIdx) // Remove all entries of the idx from the index array

    challenge_list.push(challenges[challengeIdx][0]); // Add challenge to list
    counter += challenges[challengeIdx][1];           // Increment counter
    // console.log("Counter: " + counter)
    randfloat = Math.random() * challengeDifficulty;
    // console.log("Randfloat: " + randfloat)
  }
  // console.log(challenge_list)
  document.getElementById('playerDisplay').innerHTML = "".concat(character, " on ", difficulty, " difficulty");
  document.getElementById('challengeDisplay').innerHTML = challenge_list.join("<br>");
}
