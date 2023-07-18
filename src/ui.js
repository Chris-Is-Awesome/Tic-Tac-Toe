import Game, { GameHelper } from './game.js';
import circle from './assets/img/circle.png';
import cross from './assets/img/cross.png';

export default class UI {
	constructor() {
		initializeUIAndGame();
	}

	resetGameUI() {
		// Remove board
		const board = document.querySelector("#board").innerHTML = "";

		// Toggle options visibility
		document.querySelector("#gameSetup").style.display = "block";
		document.querySelector("#gameplay").style.display = "none";
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
		startingPlayer: document.getElementById('startingPlayer').value
	};

	createBoard();
	new Game(options);

	// Toggle visibility
	document.querySelector("#gameSetup").style.display = "none";
	document.querySelector("#gameplay").style.display = "block";
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
			const cellObj = new Cell(cell, i + 1, j + 1);
			cell.setAttribute("id", `board-cell-${i+1}_${j+1}`);
			cell.setAttribute("class", "board-cell");
			cell.onclick = function () {
				GameHelper.cellClicked(cellObj);
			};
			board[i][j] = cellObj;
			row.appendChild(cell);
		}
	}
}

export const UIHelper = {
	// Returns the board (GET only accessor)
	getBoard: function () {
		return board;
	},

	// Marks the given cell as selected
	selectCell: function(cell, selectedBy) {
		console.log(`[GAME] Cell (${cell.row}, ${cell.col}) selected by ${selectedBy}!`);
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
		document.querySelector("#currentPlayer").textContent = `${currentPlayer}'s turn`;
	},

	// Shows game end UI
	gameEnded: function(result) {
		if (result.isDraw) {
			console.log("[GAME] Looks like it's a draw. How lame.");
		} else if (result.winner === "AI") {
			console.log("[GAME] You lost... wow I didn't think it was possible. Imagine losing to an AI... on EASY difficulty. I'm literally picking at random... and you lost... how embarrassing. You really should consider retiring, you're not cut out for the big leagues... or the little leagues... or any league actually. I would say better luck next time but I'd rather not play you again. You're a waste of my computing power.");
		} else {
			console.log("[GAME] Welp, you won. Oh well.");
		}
	}
}