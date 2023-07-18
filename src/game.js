import { UIHelper } from './ui.js';

export default class Game {
	constructor(optionsObj) {
		options = optionsObj;
		turnResults = null;
		startGame();
	}
}

let options;
let currentPlayer;
let turnResults;

// Start of the game (after UI initialization)
function startGame() {
	currentPlayer = options.startingPlayer === "random" ? getRandomStartingPlayer() : options.startingPlayer

	console.log(`[GAME] Game started! Starting player: ${currentPlayer}`);

	UIHelper.playersChanged(currentPlayer);

	if (currentPlayer === "AI") {
		aiTurn();
	}
}

// Returns a random starting player
function getRandomStartingPlayer() {
	const randNum = Math.floor(Math.random() * 2); // Random number: 0 or 1

	if (randNum < 1) {
		return "PLAYER";
	}

	return "AI";
}

// Swaps the players' turns, or ends the game
function changeTurns() {
	turnResults = getTurnResults();

	// If game has not ended, switch turns
	if (!turnResults.gameEnded) {
		currentPlayer = currentPlayer === "AI" ? "PLAYER" : "AI";
		UIHelper.playersChanged(currentPlayer);

		if (currentPlayer === "AI") {
			aiTurn();
		}
	}
	// If game has ended, show game end UI
	else {
		UIHelper.gameEnded(turnResults);
	}
}

// Plays out the AI's turn
function aiTurn() {
	aiTurn_Easy();
	changeTurns();
}

// Selects a random cell
function aiTurn_Easy() {
	const cells = getUncheckedBoardCells();
	const randCell = cells[Math.floor(Math.random() * cells.length)];

	UIHelper.selectCell(randCell, "AI");
}

// Returns an array of all unchecked cells in the board
function getUncheckedBoardCells() {
	const board = UIHelper.getBoard();
	let uncheckedCells = [];

	for (let i = 0; i < board.length; i++) {
		const row = board[i];
		for (let col in row) {
			const cell = row[col];
			
			if (!cell.checkedBy) {
				uncheckedCells.push(cell);
			}
		}
	}

	return uncheckedCells;
}

// Checks for if the game has ended and returns the result
function getTurnResults() {
	board = UIHelper.getBoard();

	const result = {
		gameEnded: hasMatchInRow(board) || hasMatchInCol(board) || hasMatchInDiag(board),
		isDraw: false,
		winner: null
	};

	if (result.gameEnded) {
		result.winner = currentPlayer;
	} else {
		result.isDraw = isDraw(board);
		result.gameEnded = result.isDraw;
	}

	return result;
}

// Checks for row match
function hasMatchInRow(board) {
	for (let i = 0; i < board.length; i++) {
		if (
			board[i][0].checkedBy !== null &&
			board[i][0].checkedBy === board[i][1].checkedBy &&
			board[i][1].checkedBy === board[i][2].checkedBy
		) {
			return true;
		}
	}

	return false;
}

// Checks for column match
function hasMatchInCol(board) {
	for (let i = 0; i < board[0].length; i++) {
		if (
			board[0][i].checkedBy !== null &&
			board[0][i].checkedBy === board[1][i].checkedBy &&
			board[1][i].checkedBy === board[2][i].checkedBy
		) {
			return true;
		}
	}

	return false;
}

// Checks for diagonal match
function hasMatchInDiag(board) {
	if (
		board[0][0].checkedBy !== null &&
		board[0][0].checkedBy === board[1][1].checkedBy &&
		board[1][1].checkedBy === board[2][2].checkedBy
	) {
		return true;
	}

	if (
		board[0][2].checkedBy !== null &&
		board[0][2].checkedBy === board[1][1].checkedBy &&
		board[1][1].checkedBy === board[2][0].checkedBy
	) {
		return true;
	}

	return false;
}

// Checks for draw
function isDraw(board) {
	for (let i = 0; i < board.length; i++) {
		for (let j = 0; j < board[i].length; j++) {
			if (board[i][j].checkedBy === null) {
				return false;
			}
		}
	}

	return true;
}

export const GameHelper = {
	// Runs when a cell is clicked
	cellClicked: function (cell) {
		// If game has not ended and is player's turn
		if (currentPlayer === "PLAYER" && (!turnResults || !turnResults.gameEnded)) {
			// Select the clicked cell
			UIHelper.selectCell(cell, currentPlayer);
			changeTurns();
		}
	}
}