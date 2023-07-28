import { UIHelper } from './ui.js';

export default class Game {
	constructor(optionsObj) {
		options = optionsObj;
		turnResult = null;
		startGame();
	}
}

let options;
let currentPlayer;
let turnResult;

// Start of the game (after UI initialization)
function startGame() {
	currentPlayer = options.startingPlayer === "random" ? getRandomStartingPlayer() : options.startingPlayer.toUpperCase();

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
	// If game has not ended, switch turns
	if (!turnResult.gameEnded) {
		currentPlayer = currentPlayer === "AI" ? "PLAYER" : "AI";
		UIHelper.playersChanged(currentPlayer);

		if (currentPlayer === "AI") {
			aiTurn();
		}
	}
	// If game has ended, show game end UI
	else {
		UIHelper.gameEnded(turnResult);
	}
}

// Plays out the AI's turn
async function aiTurn() {
	if (!options.fastAITurn) {
		UIHelper.updateCursor("wait");
		await waitForSeconds(1000);
	}

	const cells = getUncheckedBoardCells();
	const selectedCell = cells[Math.floor(Math.random() * cells.length)];

	UIHelper.selectCell(selectedCell, "AI");
	UIHelper.updateCursor("pointer");
	turnEnded(selectedCell);
}

// Returns an array of all unchecked cells in the board
function getUncheckedBoardCells() {
	return UIHelper.getBoard().filter(cell => !cell.checkedBy);
}

// Checks for if the game has ended and returns the result
function turnEnded(selectedCell) {
	const board = UIHelper.getBoard();
	const rowMatch = hasMatchInRow(board, selectedCell.row);
	const colMatch = hasMatchInCol(board, selectedCell.col);
	const diagMatch = hasMatchInDiag(board);

	const result = {
		gameEnded: 
			rowMatch.length > 0 ||
			colMatch.length > 0 ||
			diagMatch.length > 0,
		isDraw: false,
		winner: null,
		matchingCells: []
	};

	if (result.gameEnded) {
		result.winner = currentPlayer;
		
		if (rowMatch.length > 0) {
			result.matchingCells = rowMatch;
		} else if (colMatch.length > 0) {
			result.matchingCells = colMatch;
		} else {
			result.matchingCells = diagMatch;
		}
	} else {
		result.isDraw = isDraw(board);
		result.gameEnded = result.isDraw;
	}

	turnResult = result;
	changeTurns();
}

// Checks for row match
function hasMatchInRow(board, row) {
	const matchesRequired = clamp(UIHelper.getBoardSize(), 3, 5);
	let markedCells = board.filter(cell => cell.row === row && cell.checkedBy === currentPlayer);
	let matches = [];

	if (markedCells != null) {
		for (let i = 0; i < markedCells.length; i++) {
			if (i > 0 && matches.length < matchesRequired && markedCells[i].col - 1 != markedCells[i-1].col) {
				matches = [];
			}

			if (matches.length >= matchesRequired) {
				break;
			}

			matches.push(markedCells[i]);
		}

		if (matches.length < matchesRequired) {
			matches = [];
		}
	}

	return matches;
}

// Checks for column match
function hasMatchInCol(board, col) {
	const matchesRequired = clamp(UIHelper.getBoardSize(), 3, 5);
	let markedCells = board.filter(cell => cell.col === col && cell.checkedBy === currentPlayer);
	let matches = [];

	if (markedCells != null) {
		for (let i = 0; i < markedCells.length; i++) {
			if (i > 0 && matches.length < matchesRequired && markedCells[i].row - 1 != markedCells[i-1].row) {
				matches = [];
			}

			if (matches.length >= matchesRequired) {
				break;
			}

			matches.push(markedCells[i]);
		}

		if (matches.length < matchesRequired) {
			matches = [];
		}
	}

	return matches;
}

// Checks for diagonal match
function hasMatchInDiag(board) {
	const boardSize = parseInt(UIHelper.getBoardSize());
	const matchesRequired = clamp(boardSize, 3, 5);
	let matches = [];

	// Going top left to bottom right
	for (let i = 0; i < boardSize; i++) { 
		const cell = board[(boardSize + 1) * i];

		// If cell was checked by current player, it's a match
		if (cell.checkedBy === currentPlayer) {
			matches.push(cell);
		// If cell is empty while there are not enough matches and cell, reset matches
		} else if (matches.length > 0 && matches.length < matchesRequired) {
			matches = [];
		// If cell empty after required number of matches has been met, end loop
		} else if (matches.length >= matchesRequired) {
			break;
		}
	}

	// If the required number of matches has not been met, reset matches before changing diagonal direction
	if (matches.length < matchesRequired) {
		matches = [];
	// If the required number of matches has been met, return matches
	} else {
		return matches;
	}

	// Going top right to bottom left
	for (let i = 1; i < boardSize + 1; i++) {
		const cell = board[(boardSize - 1) * i];

		// If cell was checked by current player, it's a match
		if (cell.checkedBy === currentPlayer) {
			matches.push(cell);
			// If cell is empty while there are not enough matches and cell, reset matches
		} else if (matches.length > 0 && matches.length < matchesRequired) {
			matches = [];
			// If cell empty after required number of matches has been met, end loop
		} else if (matches.length >= 5) {
			break;
		}
	}

	// If the required number of matches has not been met, reset matches before changing diagonal direction
	if (matches.length < matchesRequired) {
		matches = [];
	}

	return matches;
}

// Checks for draw
function isDraw(board) {
	return board.every(cell => cell.checkedBy);
}

// Waits for the specified time
function waitForSeconds(milliseconds) {
	return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function clamp(number, min, max) {
	return Math.max(min, Math.min(number, max));
}

export const GameHelper = {
	// Runs when a cell is clicked
	cellClicked: function (cell) {
		// If game has not ended and is player's turn
		if (currentPlayer === "PLAYER" && !cell.checkedBy && (!turnResult || !turnResult.gameEnded)) {
			// Select the clicked cell
			UIHelper.selectCell(cell, currentPlayer);
			turnEnded(cell);
		}
	}
}