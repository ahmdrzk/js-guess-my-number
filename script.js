/* SELECTED ELEMENTS */
/* -- BUTTONS */
const startOverButton = document.querySelector("#start-over-button");
const startPlayButton = document.querySelector("#start-play-button");
const playButton = document.querySelector("#play-button");
/* -- INPUTS */
const playerName = document.querySelector("#name");
const playerAge = document.querySelector("#age");
const playerLocation = document.querySelector("#location");
const playerGenderRadioGroup = document.querySelector("#gender-radio-group");
const currGuessNumInput = document.querySelector("#guess-number");
/* -- GAME STATUS */
const gameStatusHeading = document.querySelector(".game > h2");
const gameBackdrop = document.querySelector(".backdrop");
/* -- GAME RECORDS */
const currScoreOutput = document.querySelector("#score > strong");
const currTriesOutput = document.querySelector("#tries > strong");
const currRoundOutput = document.querySelector("#rounds > strong");
const currRoundsProgress = document.querySelector("#rounds-progress");
const msgSymbol = document.querySelector(".game-action__msg__symbol > span");
const msgText = document.querySelector(".game-action__msg__text");

/* STATE */
const MESSAGES = [
  "Too low ...",
  "Low ...",
  "High ...",
  "Too high ...",
  "😝 INCORRECT ROUND",
  "🎉 CORRECT NUMBER!",
  "😁 GAME OVER",
  "🎈🏆 CONGRATULATIONS! YOU WON! 🥇❤️",
];
const MAX_TRIES = 5;
const MAX_ROUNDS = 10;
const TARGET_SCORE = 60;

let playerDetails = { name: "", age: "", location: "", gender: "" };
let currTries = 0;
let currRound = 0;
let currScore = 0;
let currGuessNum = null;
let currCorrectNum = null;

const isGuessCorrect = () => currGuessNum === currCorrectNum;
const isTargetScoreReached = () => currScore >= TARGET_SCORE;
const isNextTryAllowed = () => currTries + 1 <= MAX_TRIES;
const isNextRoundAllowed = () => currRound <= MAX_ROUNDS;

/* EVENTS CREATION */
const scoreChangeEvent = new Event("scorechange");

/* HANDLERS */
const isPlayerDetailsValid = (playerDetails) => {
  if (playerDetails.name.length > 20) {
    window.alert("Name should be less than 20 characters.");
    return false;
  }

  for (key in playerDetails) {
    if (!playerDetails[key]) {
      window.alert("Please enter all details.");
      return false;
    }
  }

  return true;
};
const suspendElement = (element) => {
  element.disabled = true;
  element.style.pointerEvents = "none";
};
const unSuspendElement = (element) => {
  element.disabled = false;
  element.style.pointerEvents = null;
};
const generateCurrCorrectNum = () => Math.floor(Math.random() * 20) + 1;
const updateCurrScore = (incOrDec) => {
  if (incOrDec === "inc") {
    currScore += currCorrectNum;
  } else {
    currScore -= currCorrectNum;
  }

  currScoreOutput.textContent = currScore;
  currScoreOutput.dispatchEvent(scoreChangeEvent);
};
const updateCurrTries = (count) => {
  currTries = count ?? ++currTries;
  currTriesOutput.textContent = currTries;
};
const updateCurrRound = () => {
  currRound++;
  currRoundOutput.textContent = currRound;
  currRoundsProgress.value = currRound;
};
const updateMsgSymbol = (symbol) => {
  msgSymbol.textContent = symbol || currGuessNum;
};
const updateMsgText = (msgIndicator) => {
  let msg = "";
  switch (true) {
    case msgIndicator === "lose-round":
      msg = MESSAGES[4];
      break;
    case msgIndicator === "lose":
      msg = MESSAGES[6];
      break;
    case msgIndicator === "win":
      msg = MESSAGES[7];
      break;
    case msgIndicator === null:
      msg = "";
      break;
    case msgIndicator < -10:
      msg = MESSAGES[0];
      break;
    case msgIndicator < 0:
      msg = MESSAGES[1];
      break;
    case msgIndicator === 0:
      msg = MESSAGES[5];
      break;
    case msgIndicator < 10:
      msg = MESSAGES[2];
      break;
    case msgIndicator < 20:
      msg = MESSAGES[3];
      break;
  }

  msgText.textContent = msg;
};

const resetGame = () => {
  window.location.reload();
};
const startGame = (event) => {
  event.preventDefault();

  if (isPlayerDetailsValid(playerDetails)) {
    gameStatusHeading.textContent = "Game Started ...";
    gameBackdrop.classList.remove("backdrop");

    currCorrectNum = generateCurrCorrectNum();
    updateCurrRound();

    suspendElement(startPlayButton);
    unSuspendElement(currGuessNumInput);
    unSuspendElement(playButton);
  }
};
const endGame = (winOrLose) => {
  updateMsgSymbol("🕹️");
  updateMsgText(winOrLose);
  suspendElement(currGuessNumInput);
  suspendElement(playButton);
};
const prepareNextRound = () => {
  suspendElement(currGuessNumInput);
  playButton.value = "next";
  playButton.textContent = `Start Round ${currRound}!`;
};
const checkTurn = () => {
  if (currGuessNum < 1 || currGuessNum > 20) {
    window.alert("Please enter a number between 1 and 20 (inclusive).");
    return;
  }
  console.log(currGuessNum, currCorrectNum);

  updateCurrTries();
  updateMsgSymbol();
  updateMsgText(currGuessNum - currCorrectNum);
  currGuessNumInput.value = null;

  const checkTargetScoreAndRound = () => {
    if (isTargetScoreReached()) {
      console.log("isTargetScoreReached()");
      endGame("win");
    } else {
      console.log("!isTargetScoreReached()");
      if (isNextRoundAllowed()) {
        console.log("isNextRoundAllowed()");
        prepareNextRound();
      } else {
        console.log("!isNextRoundAllowed()");
        endGame("lose");
      }
    }
  };

  if (isGuessCorrect()) {
    console.log("isGuessCorrect()");
    updateCurrScore("inc");
    updateCurrRound();

    checkTargetScoreAndRound();
  } else {
    console.log("!isGuessCorrect()");
    if (isNextTryAllowed()) {
      console.log("isNextTryAllowed()");
      currGuessNum = null;
      return;
    } else {
      console.log("!isNextTryAllowed()");
      updateCurrScore("dec");
      updateCurrRound();
      updateMsgText("lose-round");

      checkTargetScoreAndRound();
    }
  }

  currGuessNum = null;
};
const startNextRound = () => {
  currCorrectNum = generateCurrCorrectNum();
  updateCurrTries(0);
  updateMsgSymbol("?");
  updateMsgText(null);

  unSuspendElement(currGuessNumInput);
  playButton.value = "check";
  playButton.textContent = "Check!";
};
const gameTurn = (event) => {
  event.preventDefault();

  if (event.target.value === "check") {
    checkTurn();
    return;
  }

  if (event.target.value === "next") {
    startNextRound();
    return;
  }
};

/* EVENT LISTENERS */
playerName.addEventListener(
  "input",
  (event) => (playerDetails.name = event.target.value)
);

playerAge.addEventListener(
  "input",
  (event) => (playerDetails.age = event.target.value)
);

playerLocation.addEventListener(
  "input",
  (event) => (playerDetails.location = event.target.selectedOptions[0].value)
);

playerGenderRadioGroup.addEventListener(
  "change",
  (event) => (playerDetails.gender = event.target.value)
);

currGuessNumInput.addEventListener(
  "input",
  (event) => (currGuessNum = +event.target.value)
);

currScoreOutput.addEventListener("scorechange", (event) => {
  const currScoreRow = event.target.parentElement.parentElement.parentElement;
  currScoreRow.style.backgroundColor = "lime";
  window.setTimeout(() => {
    currScoreRow.style.backgroundColor = null;
  }, 2000);
});

startOverButton.addEventListener("click", resetGame);
startPlayButton.addEventListener("click", startGame);
playButton.addEventListener("click", gameTurn);
