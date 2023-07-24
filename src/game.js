import Debug from "./debug.js";
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

	// Get random difficulty
	if (options.difficulty === "random") {
		const difficulties = UIHelper.getElement("#ai-difficulty").options;
		options.difficulty = difficulties[Math.floor((Math.random() * (difficulties.length - 1))) + 1].value;
		Debug.log(`Random AI difficulty selected: ${options.difficulty.toUpperCase()}`);
	}

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
		currentPlayer == "PLAYER";
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

	let selectedCell;

	switch (options.difficulty) {
		case "easy":
			selectedCell = aiTurn_Easy();
			break;
		case "casual":
			selectedCell = aiTurn_Casual();
			break;
		case "hard":
			selectedCell = aiTurn_Hard();
			break;
		case "expert":
			selectedCell = aiTurn_Expert();
			break;
		default:
			Debug.log(`${options.difficulty} does not have a case!`);
	}
	
	if (selectedCell) {
		UIHelper.selectCell(selectedCell, "AI");
		turnEnded(selectedCell);
	}

	UIHelper.updateCursor("pointer");
}

// Selects a random cell
function aiTurn_Easy() {
	const cells = getUncheckedBoardCells();
	return cells[Math.floor(Math.random() * cells.length)];
}

function aiTurn_Casual() {
	Debug.log("TODO: AI turn for casual difficulty");
}

function aiTurn_Hard() {
	Debug.log("TODO: AI turn for hard difficulty");
}

function aiTurn_Expert() {
	Debug.log("TODO: AI turn for expert difficulty");
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
	let matches = board.filter(cell => cell.row === row && cell.checkedBy === currentPlayer);

	if (matches != null && matches.length < clamp(UIHelper.getBoardSize(), 3, 5)) {
		matches = [];
	}
	return matches;
}

// Checks for column match
function hasMatchInCol(board, col) {
	let matches = board.filter(cell => cell.col === col && cell.checkedBy === currentPlayer);

	if (matches != null && matches.length < clamp(UIHelper.getBoardSize(), 3, 5)) {
		matches = [];
	}

	return matches;
}

// Checks for diagonal match
function hasMatchInDiag(board) {
	const boardSize = parseInt(UIHelper.getBoardSize());
	let matches = [];
	let matchesInARow = 0;

	// Going top left to bottom right
	for (let i = 0; i < boardSize; i++) {
		const cell = board[(boardSize + 1) * i];

		if (cell && cell.checkedBy === currentPlayer) {
			matches.push(cell);
			matchesInARow++;
		}
	}

	if (matchesInARow >= clamp(boardSize, 3, 5)) {
		return matches;
	} else {
		matchesInARow = 0;
	}

	// Going top right to bottom left
	for (let i = 1; i < boardSize + 1; i++) {
		const cell = board[(boardSize - 1) * i];

		if (cell && cell.checkedBy === currentPlayer) {
			matches.push(cell);
			matchesInARow++;
		}
	}

	if (matchesInARow < clamp(boardSize, 3, 5)) {
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