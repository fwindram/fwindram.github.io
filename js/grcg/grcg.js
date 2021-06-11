// IDEAS:
// Allow users to change the max counter value (so they can increase the difficulty)

const difficulties = ["Normal", "Elite", "Nightmare", "Any"]

const characters = ["Ao Bai", "Crown Prince", "Qing Yan", "Lei Luo", "Any Character"]

// [challenge, weight]
// Any challenge with a weight of 1 will stop sampling after it is picked
const challenges = [
  ["Normal Run", 1],
  ["Speedrun", 0.4],
  ["No Dash", 0.5],
  ["No Sound", 0.5],
  ["No Craftsman", 0.3],
  ["No Kermit", 0.3],
  ["No Vaults", 0.3],
  ["All Vaults", 0.1],
  ["No Cursed Chests", 0.3],
  ["All Cursed Chests", 0.3],
  ["No Secondary Skills", 0.3],
  ["No Primary Skills", 0.3],
  ["No Scrolls", 1],
  ["No Acensions", 1],
  ["No Revive", 0.3],
  ["No Manual Reloads", 0.2],
  ["No Elemental Weapons", 0.2],
  ["No Insurance: Try not to break anything", 0.2],
  ["Butterfingers: Always pick up new weapons", 0.2],
  ["Sticky Fingers: Never pick up new weapons", 0.2],
  ["Rebind Hell: Invert Movement Bindings", 1],
  ["Pimm's Curse: Invert mouse buttons, axis, & movement", 1],
  ["NES Mode: Lowest Resolution", 1],
  ["Foundry Only", 0.5],
  ["Pistols", 0.5],
  ["Submachineguns", 0.3],
  ["Rifles", 0.3],
  ["Shotguns", 0.3],
  ["Snipers", 0.3],
  ["Launchers", 0.3],
  ["Injectors", 0.3],
  ["Melee", 0.3],
  ["Only Fire Weapons", 0.3],
  ["Only Corrosion Weapons", 0.3],
  ["Only Lightning Weapons", 0.3],
  ["Student Loan: Spend money ASAP", 0.5],
  ["No Gemini", 0.1],
  ["OGemini: No reforging", 0.1],
  ["NoUI: Press F10 to play without UI", 0.7],
  ["Backwards movement only", 0.4],
  // ["Only Turn Left", 0.5],
  // ["Only Turn Right", 0.5],
  ["Switch mouse buttons", 0.5],
  ["Change Language", 0.6],
  ["Use a controller", 0.4],
]

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

function generateRun() {
  // console.log("Generating new run...")
  // let outstr = ""
  let difficulty = difficulties[Math.floor(Math.random() * difficulties.length)]
  // console.log(difficulty)
  let character = characters[Math.floor(Math.random() * characters.length)]
  // console.log(character)

  let challenge_list = []
  // JS is not python! deepcopies are hard and don't necessarily happen when you think they do
  // Converting to and from JSON forces a copy and prevents the challenges_copy array from being exhausted
  let challenges_copy = JSON.parse(JSON.stringify(challenges))
  // We need to shuffle the array because js arrays do not have a pop command that will take an index to pop.
  // I'm sure all this would be a lot easier if I just learned node.js but that feels ludicrous!
  challenges_copy = shuffle(challenges_copy)

  let challenge = []
  let counter = 0
  let randfloat = 1
  while (counter < randfloat) {
    challenge = challenges_copy.pop()
    challenge_list.push(challenge[0])
    counter += challenge[1]
    // console.log("Counter: " + counter)
    randfloat = Math.random()
    // console.log("Randfloat: " + randfloat)
  }
  // console.log(challenge_list)
  document.getElementById('playerDisplay').innerHTML = "".concat(character, " on ", difficulty, " difficulty")
  document.getElementById('challengeDisplay').innerHTML = challenge_list.join("<br>")
}
