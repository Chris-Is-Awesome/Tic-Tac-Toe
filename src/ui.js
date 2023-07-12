export function initializeUI() {
	console.log("Initializing UI...");

	// Get refs
	const gameSetupDiv = document.getElementById('gameSetup');
	const gameplayDiv = document.getElementById('gameplay');

	createBoard();

	gameSetupDiv.style.display = "none";
	gameplayDiv.style.display = "block";

	console.log("...Done!");
}

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

		for (let k = 1; k < 4; k++) {
			const row = rows[j];
			const cell = document.createElement('input');
			cell.type = "text";
			cell.id = `board-row-${rowLetter}${k}`;
			cell.className = "board-cell";
			row.appendChild(cell);
		}
	}
}