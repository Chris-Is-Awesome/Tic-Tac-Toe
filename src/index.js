import UI from './ui.js';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/variables.css';
import './css/styles.css';
import './css/classes.css';
import './css/ids.css';

let ui;
let isInitialized = false;

// Listen for key inputs
document.addEventListener('keydown', function(e) {
	if (e.key === 'r' && isInitialized) {
		restartGame();
	}
	
	if (e.key === 'p' && !isInitialized) {
		setupGame();
	}

	if (e.key === 'p' && isInitialized) {
		debugger;
	}
})

function setupGame() {
	ui = new UI();
	isInitialized = true;
}

function restartGame() {
	ui.resetGameUI();
	isInitialized = false;
}

window.setupGame = setupGame;
window.restartGame = restartGame;