import { initializeUI } from './ui.js';

export default class Game {
	constructor(options) {
		currentStats.currentPlayer = options.startingPlayer === "random" ? getRandomStartingPlayer() : options.startingPlayer

		initializeUI();	
		console.log("Game started! Starting stats:\n", currentStats);
		startGame();
	}
}

const currentStats = {
	currentPlayer: null
};

// Returns a random starting player
function getRandomStartingPlayer() {
	const randNum = Math.floor(Math.random() * 2); // Random number: 0 or 1

	if (randNum < 1) {
		return "PLAYER";
	}

	return "AI";
}

function startGame() {
	//
}