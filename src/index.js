import Game from './game.js';
import './css/styles.css';

function setupGame() {
	const startingPlayer = document.getElementById('startingPlayer').value;

	// Create options object
	const options = {
		startingPlayer: startingPlayer
	};

	// Create game object & setup game
	const game = new Game(options);
}

window.setupGame = setupGame;