import circle from './assets/img/circle.png';
import cross from './assets/img/cross.png';
import { currentStats, changeTurns } from './game.js';

export default class UI {
	constructor() {
		initializeUI();
	}
}

class Cell {
	constructor(element) {
		this.element = element;
		this.row = element.id.substr(element.id.lastIndexOf('-') + 1, (element.id.indexOf('_') - (element.id.lastIndexOf('-') + 1)));
		this.col = element.id.substr(element.id.indexOf('_') + 1, element.id.length - (element.id.indexOf('_') + 1));
		this.whoChecked = null;
		this.weight = 0;
	}
}

const cells = [];
const grid = [];

// Toggles what part of the game is shown at start
function initializeUI() {
	console.log("Initializing UI...");

	const gameSetupDiv = document.getElementById('gameSetup');
	const gameplayDiv = document.getElementById('gameplay');

	createBoard();

	// Toggle visibility
	gameSetupDiv.style.display = "none";
	gameplayDiv.style.display = "block";

	console.log("...Done!");
}

// Creates the game board
function createBoard() {
	const board = document.getElementById('board-rows');

	// Create rows
	for (let i = 1; i < 4; i++) {
		const row = document.createElement('div');
		row.className = "board-row";
		board.appendChild(row);

		// Create cells
		for (let j = 1; j < 4; j++) {
			const cell = document.createElement('div');
			cell.id = `board-cell-${i}_${j}`;
			cell.className = "board-cell";
			cell.onclick = function (button) {
				cellClicked(button.originalTarget);
			}
			row.appendChild(cell);
			const cellObj = new Cell(cell);
			cells.push(cellObj);
			grid.push([{row: cellObj.row, col: cellObj.col}, cellObj]);
		}
	}

	console.table(grid);
}

// Runs when a cell is clicked
function cellClicked(cellElement) {
	const cell = cells.find(x => x.element === cellElement);
	console.log(`${currentStats.currentPlayer} selected cell ${cell.name}`);

	const img = document.createElement('img');
	img.className = "cell-image";
	
	if (currentStats.currentPlayer === "AI") {
		img.src = cross;
		img.alt = "Cross";
	} else {
		img.src = circle;
		img.alt = "Circle";
	}

	cellElement.appendChild(img);
	const gameResult = hasGameEnded(cell);

	// Check if game has ended
	if (!gameResult.winner) {
		changeTurns();
	} else {
		console.log("Game has ended!");
	}
}

function hasGameEnded(cell) {
	const result = {
		winner: null
	}

	// Logic - get the 8 adjacent cells & check their data
	// Then add -1, 0, and 1 to each number to get adjacent cells
	// If an adjacent cell is marked by same player, check next one over (don't check all adjacent of that cell)

	//

	return result;
}