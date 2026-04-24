// Initial game setup
const game = {
    humanScore: 0,
    computerScore: 0,
    maxRounds: 3,
    currentRound: 0,
    choices: ["rock", "paper", "scissors"]
}

// get computer choice
function getComputerChoice(){
    return game.choices[Math.floor(Math.random() * 3)];
}

const player1 = document.querySelector("#player-1");
const player2 = document.querySelector("#player-2");
const choiceContainer = document.getElementById("choice-container");
const choiceBoxes = choiceContainer.querySelectorAll(".choice-box")

// disable choice buttons
function choiceBtnsOff(){
    choiceBoxes.forEach(b => {
        b.classList.remove("choice-btn-on");
        b.classList.add("choice-btn-off");
    })
}

// enable choice buttons
function choiceBtnsOn(){
    choiceBoxes.forEach(b => {
        b.classList.remove("choice-btn-off");
        b.classList.add("choice-btn-on");
    })
}

// display player's choice
function displayChoice(choice, player){
    const targetP = player === 1 ? player1 : player2;

    // Hide three dots
    const pChoiceIcon = targetP.querySelector(".icon-three-dots");
    pChoiceIcon.classList.add("hidden");
    
    // Clone template
    const template = document.getElementById(`svg-${choice}-template`);
    const clone = template.content.cloneNode(true);

    // Add class for animations for the clone
    const choiceIcon = clone.querySelector(`#svg-${choice}`);
    choiceIcon.classList.toggle("hidden");
    choiceIcon.classList.add("svg-choice-appear");
    
    // Append to a container
    const iconContainer = targetP.querySelector(".icon-choice-container");
    iconContainer.appendChild(choiceIcon);
}

// hide player's choice
function hideChoice(choice, player){
    const targetP = player === 1 ? player1 : player2;
    const choiceIcon = targetP.querySelector(`#svg-${choice}`);
    const pChoiceIcon = targetP.querySelector(".icon-three-dots");

    choiceIcon.classList.add("svg-choice-disappear");

    choiceIcon.addEventListener("animationend", function handler() {
        choiceIcon.remove();
        pChoiceIcon.classList.remove("hidden");
        choiceIcon.removeEventListener("animationend", handler);
    });
}

// update score and display it
function updateAndDisplayScore(p1, p2){
    setTimeout(() => {
        // Update the Scores:
        if(p1 == "rock" && p2 == "scissors"){
            game.humanScore++;
            displayScore(1, true);
        } else if(p1 == "scissors" && p2 == "paper"){
            game.humanScore++;
            displayScore(1, true);
        } else if(p1 == "paper" && p2 == "rock"){
            game.humanScore++;
            displayScore(1, true);
        } else if(p1 == p2){
            // tie, do nothing
        } else{
            game.computerScore++;
            displayScore(2, true);
        }

    }, 500);
}

// display score animation
function displayScore(player, animation){
    const targetP = player === 1 ? player1 : player2;

    const scoreContainer = targetP.querySelector(".score");
    scoreContainer.textContent = targetP === player1 ? game.humanScore : game.computerScore;

    if(animation == true){
        scoreContainer.classList.add("score-win");
        scoreContainer.addEventListener("animationend", function handler() {
            scoreContainer.classList.remove("score-win");
            scoreContainer.removeEventListener("animationend", handler);
        });
    }
}

// handle a round
function handleRound(hChoice){
    displayChoice(hChoice, 1);

    // Delay computer choice by animation duration
    setTimeout(() => {
        const cChoice = getComputerChoice();
        displayChoice(cChoice, 2);

        // Re-enable buttons after both choices are displayed
        updateAndDisplayScore(hChoice, cChoice);
        setTimeout(() => {
            hideChoice(cChoice, 2);
            hideChoice(hChoice, 1);
        }, 1450); // wait for svg-choice-appear animation to finish
    }, 1500); // adjust delay to match animation
}

const turnContainer = document.querySelector("#turn-container");

// change the turn display
function changeTurn(player){
    const targetP_name = player == 1 ? "Human" : "PC";

    turnContainer.classList.add("turn-expand");
    turnContainer.textContent = `${targetP_name}'s turn`;
    
    turnContainer.addEventListener("animationend", () => {
        turnContainer.classList.remove("turn-expand");
    });
}

const roundContainer = document.querySelector("#game-roundCount-container");
roundContainer.textContent = `Rounds: ${game.currentRound}/${game.maxRounds}`;

// handle round count
function handleCountRound(){
    game.currentRound++;
    displayCountRound();

    if(game.currentRound == game.maxRounds){
        console.log("NOT");
        displayGameEnd();
    }
}

// display round count
function displayCountRound(){
    roundContainer.textContent = `Rounds: ${game.currentRound}/${game.maxRounds}`;
}

const rockBtn = document.getElementById("rock");
const paperBtn = document.getElementById("paper");
const scissorsBtn = document.getElementById("scissors");

const box = document.querySelectorAll(".choice-box");

// button click events
box.forEach(b => {
    b.addEventListener("click", () => {
        // Disable buttons
        choiceBtnsOff();
        changeTurn(2);

        // Round handling
        const choice = b.id;
        handleRound(choice);

        // Re-enable buttons, change turn display
        setTimeout(() => {
            changeTurn(1);
            choiceBtnsOn();
            handleCountRound();
        }, 3500);

    });
});

// reset game function
function resetGame(){
    game.humanScore = 0;
    game.computerScore = 0;
    game.currentRound = 0;

    displayCountRound();
    displayScore(1, false);
    displayScore(2, false);
}

// display end game pop up
function displayGameEnd(){
    const gamePopUpContainer = document.querySelector("#game-endPopUp-container");
    const gamePopUpBox = gamePopUpContainer.querySelector("#game-endPopUp-box");

    gamePopUpContainer.classList.add("game-endPopUp-container-fadeIn");
    gamePopUpBox.classList.add("game-endPopUp-box-expand");
}

function hideGameEnd(){
    const gamePopUpContainer = document.querySelector("#game-endPopUp-container");
    const gamePopUpBox = gamePopUpContainer.querySelector("#game-endPopUp-box");

    gamePopUpContainer.classList.remove("game-endPopUp-container-fadeIn");

    gamePopUpBox.classList.remove("game-endPopUp-box-expand");
}

const retryBtn = document.querySelector("#game-endPopUp-retryBtn");
retryBtn.addEventListener("click", () => {
    hideGameEnd();
    resetGame();
});
