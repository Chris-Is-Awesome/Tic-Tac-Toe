class Cell {
	constructor(cellName) {
		this.name = cellName;
		this.whoChecked = null;
		this.weight = 0;
	}
}

const cells = [];

// Toggles what part of the game is shown at start
export function initializeUI() {
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
	let rows = [];

	// Create rows
	for (let i = 0; i < 3; i++) {
		const row = document.createElement('div');
		row.className = "board-row";
		board.appendChild(row);
		rows.push(row);
	}

	// Get row letter
	for (let j = 0; j < rows.length; j++) {
		let rowLetter = 'A';

		switch (j) {
			case 1:
				rowLetter = 'B';
				break;
			case 2:
				rowLetter = 'C';
				break;
			default:
				rowLetter = 'A';
		}

		// Create cells
		for (let k = 1; k < 4; k++) {
			const row = rows[j];
			const cell = document.createElement('input');
			const cellName = `${rowLetter}${k}`;
			cell.type = "text";
			cell.id = `board-cell-${cellName}`;
			cell.className = "board-cell";
			row.appendChild(cell);
			cells.push(new Cell(cellName));
		}
	}
}