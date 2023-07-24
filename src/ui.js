import Game, { GameHelper } from './game.js';
import circle from './assets/img/circle.png';
import cross from './assets/img/cross.png';

export default class UI {
	constructor() {
		initializeUIAndGame();
	}

	resetGameUI() {
		const playAgainBtn = document.querySelector("#play-again-btn");

		playAgainBtn.setAttribute('class', "btn btn-outline-danger");
		playAgainBtn.textContent = "Restart";
		document.querySelector("#board").innerHTML = "";
		document.querySelector("#game-setup").style.display = "block";
		document.querySelector("#gameplay").style.display = "none";
		document.querySelector("#current-player-info").style.display = "block";
		document.querySelector("#game-end-result").textContent = "";
	}
}

class Cell {
	constructor(element, row, col) {
		this.element = element;
		this.row = row;
		this.col = col;
		this.checkedBy = null;
	}
}

let board;

// Toggles what part of the game is shown at start
function initializeUIAndGame() {
	// Create options object
	const options = {
		startingPlayer: document.querySelector("#starting-player").value,
		difficulty: document.querySelector("#ai-difficulty").value,
		fastAITurn: document.querySelector("#fast-ai-turns").checked
	};

	createBoard();
	new Game(options);

	// Toggle visibility
	document.querySelector("#game-setup").style.display = "none";
	document.querySelector("#gameplay").style.display = "block";
}

// Creates the game board
function createBoard() {
	const boardElement = document.querySelector('#board');
	const boardSize = document.querySelector('#board-size').value;
	board = [];

	for (let i = 0; i < boardSize; i++) {
		const row = document.createElement('div');
		row.setAttribute("class", "board-row");
		boardElement.appendChild(row);

		for (let j = 0; j < boardSize; j++) {
			const cell = document.createElement('div');
			const cellObj = new Cell(cell, i + 1, j + 1);
			createCellBorder(cellObj, boardSize);
			cell.setAttribute("id", `board-cell-${i+1}_${j+1}`);
			cell.setAttribute("class", "board-cell");
			cell.onclick = function () {
				GameHelper.cellClicked(cellObj);
			};
			board.push(cellObj);
			row.appendChild(cell);
		}
	}
}

function createCellBorder(cellObj, boardSize) {
	const cell = cellObj.element;
	const row = cellObj.row;
	const col = cellObj.col;
	const border = "1px solid var(--offWhite)";

	// If cell is on left side of board
	if (col < 2) {
		// If cell is top left corner of board
		if (row < 2) {
			cell.style = `
				border-bottom: ${border};
				border-right: ${border};`;
		}

		// If cell is bottom left corner of board
		else if (row >= boardSize) {
			cell.style = `
				border-top: ${border};
				border-right: ${border};`;
		}

		// If cell is in a middle spot on left side of board
		else {
			cell.style = `
				border-top: ${border};
				border-bottom: ${border};
				border-right: ${border};`;
		}

		return;
	}

	// If cell is on right side of board
	if (col >= boardSize) {
		// If cell is top right corner of board
		if (row < 2) {
			cell.style = `
			border-bottom: ${border};
			border-left: ${border};`;
		}

		// If cell is bottom right corner of board
		else if (row >= boardSize) {
			cell.style = `
			border-top: ${border};
			border-left: ${border};`;
		}

		// If cell is in a middle spot on right side of board
		else {
			cell.style = `
			border-top: ${border};
			border-bottom: ${border};
			border-left: ${border}`;
		}

		return;
	}

	// If cell is on top side of board (this is after corners are dealt with)
	if (row < 2) {
		cell.style = `
		border-bottom: ${border};
		border-right: ${border};
		border-left: ${border};`;

		return;
	}

	// If cell is on bottom side of board (this is after corners are dealth with)
	if (row >= boardSize) {
		cell.style = `
		border-top: ${border};
		border-right: ${border};
		border-left: ${border};`;

		return;
	}

	// If none of the above conditions are met, we know cell is in a middle spot
	cell.style = `border: ${border};`;
}

export const UIHelper = {
	// Returns the board (GET only accessor)
	getBoard: function () {
		return board;
	},

	// Returns the board size (GET only accessor)
	getBoardSize: function() {
		return document.querySelector('#board-size').value;
	},

	// Returns the element found via selector
	getElement(selector) {
		return document.querySelector(selector);
	},

	// Updates board cursor
	updateCursor: function(cursor) {
		for (let i = 0; i < board.length; i++) {
			board[i].element.style.cursor = cursor;
		}

		console.log(cursor);
	},

	// Marks the given cell as selected
	selectCell: function(cell, selectedBy) {
		cell.checkedBy = selectedBy;

		// Show image
		const img = document.createElement("img");
		img.setAttribute("class", "cell-image");
		img.setAttribute("src", selectedBy === "AI" ? cross : circle);
		img.setAttribute("alt", selectedBy === "AI" ? "Cross" : "Circle");
		cell.element.appendChild(img);
	},

	// Updates current player UI
	playersChanged: function(currentPlayer) {
		const currentPlayerElement = document.querySelector("#current-player");
		const currentPlayerImage = document.querySelector("#current-player-img");
		currentPlayerImage.setAttribute("src", currentPlayer === "AI" ? cross : circle);
		currentPlayerImage.style = "position: relative; width: 4%; height: 4%; top: 15px;";
		currentPlayerElement.textContent = currentPlayer;
		currentPlayerElement.style.color = currentPlayer === "AI" ? "rgb(238, 81, 129)" : "rgb(37, 186, 235)";
	},

	// Shows game end UI
	gameEnded: function(result) {
		const gameEndInfo = document.querySelector("#game-end-result");
		const playAgainBtn = document.querySelector("#play-again-btn");
		document.querySelector('#current-player-info').style.display = "none";
		playAgainBtn.setAttribute('class', "btn btn-outline-success");
		playAgainBtn.textContent = "Play again";


		if (result.isDraw) {
			gameEndInfo.textContent = "No toes were tic(kled) or tac(kled).";
			gameEndInfo.style.color = "#7a7878";
		} else if (result.winner === "AI") {
			gameEndInfo.textContent = "You tac(kled) your last toe...";
			gameEndInfo.style.color = "#ff5959";

			// Color all cells in winner's color
			for (let i = 0; i < board.length; i++) {
				board[i].element.style = "border: 2.5px solid var(--lightRed);";
			}

			// Highlight matching cells
			for (let i = 0; i < result.matchingCells.length; i++) {
				const cell = result.matchingCells[i];
				cell.element.style = "border: 7.5px solid var(--lightRed);";
			}
		} else {
			gameEndInfo.textContent = "You tic(kled) the toe!";
			gameEndInfo.style.color = "#93f57a";

			// Color all cells in winner's color
			for (let i = 0; i < board.length; i++) {
				board[i].element.style = "border: 2.5px solid var(--lightBlue);";
			}

			// Highlight matching cells
			for (let i = 0; i < result.matchingCells.length; i++) {
				const cell = result.matchingCells[i];
				cell.element.style = "border: 7.5px solid var(--lightBlue);";
			}
		}

		this.updateCursor("not-allowed");
	}
}