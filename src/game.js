export default class Game {
	constructor(options) {
		currentPlayer = options.startingPlayer === "random" ? getRandomStartingPlayer() : options.startingPlayer

		console.log(`[GAME] Game started! Starting player: ${currentPlayer}\n--------------------------------------------------`);
	}
}

export let currentPlayer;

// Swaps the players' turns
export function changeTurns() {
	currentPlayer = currentPlayer === "AI" ? "PLAYER" : "AI";
}

// Returns a random starting player
function getRandomStartingPlayer() {
	const randNum = Math.floor(Math.random() * 2); // Random number: 0 or 1

	if (randNum < 1) {
		return "PLAYER";
	}

	return "AI";
}