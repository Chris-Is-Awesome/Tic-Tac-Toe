export default class Game {
	constructor(options) {
		currentStats.currentPlayer = options.startingPlayer === "random" ? getRandomStartingPlayer() : options.startingPlayer

		console.log("Game started! Starting stats:\n", currentStats);
		startGame();
	}
}

export const currentStats = {
	currentPlayer: null
};

export function changeTurns() {
	currentStats.currentPlayer = currentStats.currentPlayer === "AI" ? "PLAYER" : "AI";
	console.log(`Turns have changed! Current turn: ${currentStats.currentPlayer}`);
}

// Returns a random starting player
function getRandomStartingPlayer() {
	const randNum = Math.floor(Math.random() * 2); // Random number: 0 or 1

	if (randNum < 1) {
		return "PLAYER";
	}

	return "AI";
}

function startGame() {
	console.log(currentStats.currentPlayer);
}