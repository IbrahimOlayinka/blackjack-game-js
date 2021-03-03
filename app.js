//Creating a deck of 52 cards
const suits = ["Hearts", "Clubes", "Diamonds", "Spades"];
const values = ["Ace", "King", "Queen", "Jack", "Ten", "Nine", "Eight", "Seven", "Six", "Five", "Four", "Three", "Two"];

// DOM Elements
const textArea = document.getElementById("text-area");
const newGameButton = document.getElementById("new-game-button");
const hitButton = document.getElementById("hit-button");
const stayButton = document.getElementById("stay-button");

let gameStarted = false;
    gameOver = false;
    playerWon = false;
    dealerCards = [];
    playerCards = [];
    dealerScore = 0;
	playerScore = 0;

// Reset the default DOM styling
hitButton.style.display = "none";
stayButton.style.display = "none";
document.getElementById("scores").innerHTML = null;
showStatus();

newGameButton.addEventListener("click", () => {
    gameStarted = true;
    gameOver = false;
    playerWon = false;

    deck = createDeck();
    shuffleDeck(deck);
    dealerCards = [ getNextCard(), getNextCard() ];
    playerCards = [ getNextCard(), getNextCard() ];
});


newGameButton.addEventListener("click", () => {
    textArea.innerText = "Started.....";
    hitButton.style.display = "inline";
    stayButton.style.display = "inline";
	newGameButton.style.display = "none";
	document.getElementById("scores").innerHTML = `Points : ${scores}`;
    showStatus();
});

hitButton.addEventListener("click", () => {
	playerCards.push(getNextCard());
	checkForEndGame();
	showStatus();
});

stayButton.addEventListener("click", () => {
	gameOver = true;
	checkForEndGame();
	showStatus();
});


function createDeck() {
    let deck = [];
    for(let suitIdx = 0; suitIdx < suits.length; suitIdx++) {
        for(valueIdx = 0; valueIdx < values.length; valueIdx++) {
            let cards = {
                suit: suits[suitIdx],
                value:  values[valueIdx]
            };
            deck.push(cards);
        }
    }
    return deck;
}

function shuffleDeck(deck) {
	for(let i = 0; i < deck.length; i++ ) {
		let swapIdx = Math.floor(Math.random() * deck.length);
		let tmp = deck[swapIdx];
			deck[swapIdx] = deck[i];
			deck[i] = tmp;
	}
}

let deck = createDeck();

//Get next card
function getNextCard() {
    return deck.shift();
}

function getCardString(card) {
	return `${card.value} of ${card.suit}`;
};

function getCardNumberValue(card) {
	switch(card.value) {
		case "Ace":
			return 1;
		case "Two":
			return 2;
		case "Three":
			return 3;
		case "Four":
			return 4;
		case "Five":
			return 5;
		case "Six":
			return 6;
		case "Seven":
			return 7;
		case "Eight":
			return 8;
		case "Nine":
			return 9;
		default:
			return 10;
	}
}

function getScore(cardArray) {
	let score = 0;
	let hasAce = false;
	for (let i = 0; i < cardArray.length; i++) {
		let card = cardArray[i];
		score += getCardNumberValue(card);
		if (card.value === "Ace") {
			hasAce = true;
		}
	}
	if (hasAce && score + 10 <= 21) {
		return score + 10;
	}
	return score;
}

function updateScores() {
	dealerScore = getScore(dealerCards);
	playerScore = getScore(playerCards);
}

function checkForEndGame() {

	updateScores();

	if (gameOver) {
		// let dealer take cards
		while(dealerScore < playerScore
			&& playerScore <= 21
			&& dealerScore <= 21) {
				dealerCards.push(getNextCard());
				updateScores();
			}
	}

	if (playerScore > 21) {
		playerWon = false;
		gameOver = true;
	}
	else if (dealerScore > 21) {
		playerWon = true;
		gameOver = true;

		scores*= 2;
		document.getElementById("scores").innerHTML = `Points: ${scores}`;
	}
	else if (gameOver) {

		if (playerScore > playerScore) {
			playerWon = true;
		}
		else {
			playerWon = false;
		}
	}
}

function showStatus() {
	if(!gameStarted) {
		textArea.innerText = "WELCOME TO BLACKJACK";
		return;
	}

	let dealerCardString = "";
	for (let i=0; i < dealerCards.length; i++) {
		dealerCardString += getCardString(dealerCards[i]) + "\n";
	}

	let playerCardString = "";
	for (let i=0; i < playerCards.length; i++) {
		playerCardString += getCardString(playerCards[i]) + "\n";
	}

	updateScores();

	textArea.innerText =
		"DEALER HAS:\n" +
		dealerCardString +
		"(score: "+ dealerScore +")\n\n" +

		"PLAYER HAS:\n" +
		playerCardString +
		"(score: "+ playerScore +")\n\n";
	if (gameOver) {
		if (playerWon) {
			textArea.innerText += "YOU WIN";
		}
		else {
			textArea.innerText += "DEALER WINS"
		}
		newGameButton.style.display = "inline";
		hitButton.style.display = "none";
		stayButton.style.display = "none";
	}
}