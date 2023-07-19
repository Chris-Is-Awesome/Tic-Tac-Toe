import UI from './ui.js';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/variables.css';
import './css/styles.css';
import './css/classes.css';
import './css/ids.css';

let ui;

function setupGame() {
	ui = new UI();
}

function restartGame() {
	ui.resetGameUI();
}

window.setupGame = setupGame;
window.restartGame = restartGame;