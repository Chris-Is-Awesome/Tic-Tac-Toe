import Game from './game.js';
import UI from './ui.js';
import './css/styles.css';

function setupGame() {
	const startingPlayer = document.getElementById('startingPlayer').value;

	// Create options object
	const options = {
		startingPlayer: startingPlayer
	};

	// Create game object & setup game
	const game = new Game(options);
	const ui = new UI();
}

window.setupGame = setupGame;