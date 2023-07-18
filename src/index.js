import UI from './ui.js';
import './css/styles.css';

let ui;

function setupGame() {
	ui = new UI();
}

function restartGame() {
	ui.resetGameUI();
}

window.setupGame = setupGame;
window.restartGame = restartGame;