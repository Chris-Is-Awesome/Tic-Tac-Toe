import circle from './assets/img/circle.png';
import cross from './assets/img/cross.png';
import { currentPlayer, changeTurns } from './game.js';

export default class UI {
	constructor() {
		initializeUI();
	}
}

class Cell {
	constructor(row, col) {
		this.row = row;
		this.col = col;
		this.checkedBy = null;
	}
}

let board;
let gameEndResult;

// Toggles what part of the game is shown at start
function initializeUI() {
	const gameSetupDiv = document.querySelector('#gameSetup');
	const gameplayDiv = document.querySelector('#gameplay');

	createBoard();
	document.querySelector('#currentPlayer').textContent = `${currentPlayer}'s turn`;

	// Toggle visibility
	gameSetupDiv.style.display = "none";
	gameplayDiv.style.display = "block";
}

// Creates the game board
function createBoard() {
	const boardElement = document.querySelector('#board');
	const boardSize = 3;
	board = new Array(boardSize);

	for (let i = 0; i < boardSize; i++) {
		board[i] = new Array(boardSize);
	}

	for (let i = 0; i < board.length; i++) {
		const row = document.createElement('div');
		row.setAttribute("class", "board-row");
		boardElement.appendChild(row);

		for (let j = 0; j < boardSize; j++) {
			const cell = document.createElement('div');
			const cellObj = new Cell(i + 1, j + 1);
			cell.setAttribute("id", `board-cell-${i+1}_${j+1}`);
			cell.setAttribute("class", "board-cell");
			cell.onclick = function (button) {
				cellClicked(button.originalTarget, cellObj);
			};
			board[i][j] = cellObj;
			row.appendChild(cell);
		}
	}
}

// Runs when a cell is clicked
function cellClicked(cellElement, cellObj) {
	// Don't reclick the cell and don't allow clicking if game is over
	if (cellObj.checkedBy != null || (gameEndResult != null && gameEndResult.hasEnded)) {
		return;
	}

	console.log(`[GAME] Cell (${cellObj.row}, ${cellObj.col}) checked by ${currentPlayer}!`);
	cellObj.checkedBy = currentPlayer;

	// Show image
	const img = document.createElement('img');
	img.setAttribute("class", "cell-image");

	if (currentPlayer === "AI") {
		img.src = cross;
		img.alt = "Cross";
	} else {
		img.src = circle;
		img.alt = "Circle";
	}

	cellElement.appendChild(img);

	// Change turns or end game
	gameEndResult = hasGameEnded();

	if (!gameEndResult.hasEnded) {
		changeTurns();
		document.querySelector('#currentPlayer').textContent = `${currentPlayer}'s turn`;
	} else {
		const divider = "--------------------------------------------------";
		if (gameEndResult.isDraw) {
			console.log(divider + "\n[GAME] Game has ended in a draw! No one wins.\n" + divider);
		} else {
			console.log(`${divider}\n[GAME] Game has ended! ${gameEndResult.winner} won!\n${divider}`);
		}
	}
}

// Checks for if the game has ended and returns the result
function hasGameEnded() {
	const result = {
		hasEnded: hasMatchInRow() || hasMatchInCol() || hasMatchInDiag(),
		isDraw: false,
		winner: null
	};

	if (result.hasEnded) {
		result.winner = currentPlayer;
	} else {
		result.isDraw = isDraw();
		result.hasEnded = result.isDraw;
	}

	return result;
}

// Checks for row match
function hasMatchInRow() {
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
function hasMatchInCol() {
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
function hasMatchInDiag() {
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
function isDraw() {
	for (let i = 0; i < board.length; i++) {
		for (let j = 0; j < board[i].length; j++) {
			if (board[i][j].checkedBy === null) {
				return false;
			}
		}
	}

	return true;
}