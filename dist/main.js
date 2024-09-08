import { Game } from './game.js';
import { Bee } from './bee.js';
document.addEventListener('DOMContentLoaded', () => {
    // Buttons
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const exitButton = document.getElementById('exit-button');
    const playerNameInput = document.getElementById('player-name');
    // Pages
    const gamePage = document.getElementById('game-page');
    const landingPage = document.getElementById('landing-page');
    const gameOverPage = document.getElementById('game-over-page');
    let game = null;
    // Check if player name is already stored and load the game directly
    window.addEventListener('load', () => {
        const storedPlayerName = localStorage.getItem('playerName');
        // Get and convert bees from local storage
        const bees = [];
        if (localStorage.bees) {
            JSON.parse(localStorage.bees).forEach((bee) => {
                bees.push(new Bee(bee.type, bee.hp));
            });
        }
        if (storedPlayerName && bees.length) {
            document.getElementById('player-name').innerText = `${storedPlayerName}`;
            document.getElementById('greeting').innerText = `${storedPlayerName}`;
            startNewGame(storedPlayerName, bees);
        }
        else {
            // If no name is stored, show the start page
            landingPage.classList.remove('hidden');
            gamePage.classList.add('hidden');
            gameOverPage.classList.add('hidden');
        }
    });
    // Start Game event
    startButton === null || startButton === void 0 ? void 0 : startButton.addEventListener('click', () => {
        const playerName = playerNameInput.value.trim();
        // Set the player name on the game page
        document.getElementById('greeting').innerText = `${playerName}`;
        if (playerName) {
            // Save to localStorage
            localStorage.setItem('playerName', playerName);
            startNewGame(playerName);
        }
        else {
            alert('Please enter a name.');
        }
    });
    // Restart Game event
    restartButton === null || restartButton === void 0 ? void 0 : restartButton.addEventListener('click', () => {
        const playerName = document.getElementById('greeting').innerText.replace('Player: ', '');
        startNewGame(playerName);
    });
    // Exit event
    exitButton === null || exitButton === void 0 ? void 0 : exitButton.addEventListener('click', () => {
        // Remove from local stoarge
        localStorage.removeItem('playerName');
        localStorage.removeItem('bees');
        // Show landing page
        landingPage.classList.remove('hidden');
        gameOverPage.classList.add('hidden');
        gamePage.classList.add('hidden');
    });
    function startNewGame(name, bees = []) {
        document.getElementById('player-name').innerText = '';
        // Show game page
        landingPage.classList.add('hidden');
        gameOverPage.classList.add('hidden');
        gamePage.classList.remove('hidden');
        game = new Game(name, bees);
        game.startNewGame();
        const attackButton = document.getElementById('attack-button');
        attackButton === null || attackButton === void 0 ? void 0 : attackButton.addEventListener('click', () => {
            game === null || game === void 0 ? void 0 : game.attackBee(); // Attack a random bee
        });
    }
});
