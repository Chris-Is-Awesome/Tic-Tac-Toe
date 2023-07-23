import Debug from "./debug.js";
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
		document.querySelector("#game-setup").style.display = "block";
		document.querySelector("#gameplay").style.display = "none";
		document.querySelector("#game-end").style.display = "none";
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

	// Returns the element found via selector
	getElement(selector) {
		return document.querySelector(selector);
	},

	// Updates board cursor
	updateCursor: function(cursor) {
		const cells = Array.from(document.querySelectorAll(".board-cell"));

		for (let i = 0; i < cells.length; i++) {
			cells[i].style.cursor = cursor;
		}
	},

	// Marks the given cell as selected
	selectCell: function(cell, selectedBy) {
		Debug.log(`[GAME] Cell (${cell.row}, ${cell.col}) selected by ${selectedBy}!`);
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
		document.querySelector("#gameplay").style.display = "none";
		document.querySelector("#game-end").style.display = "block";
		const gameEndDiv = document.querySelector("#game-end-result");

		if (result.isDraw) {
			Debug.log("[GAME] Looks like it's a draw. How lame.", true);
			gameEndDiv.textContent = "No toes were tic(kled) or tac(kled).";
			gameEndDiv.style.color = "#7a7878";
		} else if (result.winner === "AI") {
			Debug.log("[GAME] You lost... wow I didn't think it was possible. Imagine losing to an AI... on EASY difficulty. I'm literally picking at random... and you lost... how embarrassing. You really should consider retiring, you're not cut out for the big leagues... or the little leagues... or any league actually. I would say better luck next time but I'd rather not play you again. You're a waste of my computing power.", true);
			gameEndDiv.textContent = "You tac(kled) your last toe...";
			gameEndDiv.style.color = "#ff5959";
		} else {
			Debug.log("[GAME] Welp, you won. Oh well.", true);
			gameEndDiv.textContent = "You tic(kled) the toe!";
			gameEndDiv.style.color = "#93f57a";
		}
	}
}