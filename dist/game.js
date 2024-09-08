import { Bee } from './bee.js';
export class Game {
    constructor(playerName, bees = []) {
        this.bees = [];
        this.aliveBees = {};
        this.totalHealth = 0;
        this.playerName = playerName;
        this.bees = bees;
        this.totalHealth = this.calculateTotalHealth();
        this.initBees();
        this.updateUI();
    }
    // Init bees with default parameters in case we want to change the number of the bees.
    initBees(queen = 1, worker = 5, drone = 8) {
        // If there are bees, it means that the page is loaded
        if (!this.bees.length) {
            this.bees = [];
            this.aliveBees = { queen: queen, worker: worker, drone: drone };
            for (let i = 0; i < this.aliveBees.queen; i++) {
                this.bees.push(new Bee('queen', 100));
            }
            for (let i = 0; i < this.aliveBees.worker; i++) {
                this.bees.push(new Bee('worker', 75));
            }
            for (let i = 0; i < this.aliveBees.drone; i++) {
                this.bees.push(new Bee('drone', 50));
            }
        }
        else {
            this.aliveBees = {
                queen: this.bees.filter((bee) => bee.type == 'queen' && bee.hp).length,
                worker: this.bees.filter((bee) => bee.type == 'worker' && bee.hp).length,
                drone: this.bees.filter((bee) => bee.type == 'drone' && bee.hp).length
            };
        }
        this.totalHealth = this.calculateTotalHealth();
        this.renderBeesRandomly();
    }
    /*
    *
        Attack
    *
    */
    attackBee() {
        //Update local storage after every attack (not optimal probably)
        localStorage.setItem('bees', JSON.stringify(this.bees));
        const aliveBees = this.bees.filter(bee => bee.isAlive());
        if (aliveBees.length === 0)
            return;
        const randomBee = aliveBees[Math.floor(Math.random() * aliveBees.length)];
        randomBee.attack();
        // Show the attack value on the bee
        this.showAttackValue(randomBee);
        // Update the health label of the attacked bee
        const beeIndex = this.bees.indexOf(randomBee);
        const healthLabel = document.getElementById(`health-${randomBee.type}-${beeIndex}`);
        if (healthLabel) {
            healthLabel.innerText = `HP: ${randomBee.hp}`;
        }
        // Check if the bee is dead
        if (!randomBee.isAlive()) {
            this.aliveBees[randomBee.type]--;
            // Mark bee as dead visually
            const beeElement = document.getElementById(`bee-${randomBee.type}-${this.bees.indexOf(randomBee)}`);
            if (beeElement) {
                beeElement.classList.add('dead');
            }
        }
        // Update UI after attack
        this.updateUI();
        this.checkGameOver();
    }
    // Show the attack value on the bee and make it disappear after 1 second
    showAttackValue(bee) {
        var _a;
        const beeIndex = this.bees.indexOf(bee);
        const beeElement = document.getElementById(`bee-${bee.type}-${beeIndex}`);
        if (beeElement) {
            // Create the attack value element
            const attackValueElement = document.createElement('div');
            attackValueElement.classList.add('attack-value');
            attackValueElement.innerText = `-${this.getAttackValue(bee.type)}`;
            // Position the attack value above the bee
            const beeRect = beeElement.getBoundingClientRect();
            const containerRect = (_a = document.getElementById('bee-container')) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
            if (containerRect) {
                const offsetX = beeRect.left - containerRect.left + beeRect.width / 2;
                const offsetY = beeRect.top - containerRect.top - 20;
                attackValueElement.style.left = `${offsetX}px`;
                attackValueElement.style.top = `${offsetY}px`;
            }
            // Append to the bee container
            const container = document.getElementById('bee-container');
            container === null || container === void 0 ? void 0 : container.appendChild(attackValueElement);
            // Remove the attack value after 1 second
            setTimeout(() => {
                attackValueElement.remove();
            }, 1500);
        }
    }
    // Get the attack value based on bee type
    getAttackValue(type) {
        switch (type) {
            case 'queen':
                return 8;
            case 'worker':
                return 10;
            case 'drone':
                return 12;
            default:
                return 0;
        }
    }
    /*
    *
        Health
    *
    */
    // Method to calculate the total swarm health
    calculateTotalHealth() {
        return this.bees.filter((elme) => elme.type == 'queen').length * 100 +
            this.bees.filter((elme) => elme.type == 'worker').length * 75 +
            this.bees.filter((elme) => elme.type == 'drone').length * 50;
    }
    // Method to calculate the current swarm health
    calculateCurrentHealth() {
        return this.bees.reduce((total, bee) => total + bee.hp, 0);
    }
    // Method to update the health bar
    updateHealthBar(currentHealth) {
        const healthBar = document.getElementById('health-bar');
        const healthPercentage = (currentHealth / this.totalHealth) * 100;
        healthBar.style.width = `${healthPercentage}%`;
        // Change color based on health percentage
        if (healthPercentage > 50) {
            // Green for healthy
            healthBar.style.backgroundColor = '#4caf50';
        }
        else if (healthPercentage > 25) {
            // Yellow for medium health
            healthBar.style.backgroundColor = '#ffeb3b';
        }
        else {
            // Red for low health
            healthBar.style.backgroundColor = '#f44336';
        }
    }
    /*
    *
        Render and update UI
    *
    */
    updateUI() {
        this.updateBeeIcons();
        // Update bee counts
        document.getElementById('queen-count').innerText = this.aliveBees['queen'].toString();
        document.getElementById('worker-count').innerText = this.aliveBees['worker'].toString();
        document.getElementById('drone-count').innerText = this.aliveBees['drone'].toString();
        const currentHealth = this.calculateCurrentHealth();
        this.updateHealthBar(currentHealth); // Update the health bar
    }
    // Render bee icons and position them randomly
    renderBeesRandomly() {
        const container = document.getElementById('bee-container');
        container.innerHTML = ''; // Clear previous bee icons
        this.bees.forEach((bee, index) => {
            const beeElement = document.createElement('div');
            beeElement.id = `bee-${bee.type}-${index}`;
            beeElement.classList.add('bee-icon', bee.type);
            // Create health label
            const healthLabel = document.createElement('div');
            healthLabel.id = `health-${bee.type}-${index}`;
            healthLabel.classList.add('health-label');
            healthLabel.innerText = `HP: ${bee.hp}`;
            // Add health label under the bee
            beeElement.appendChild(healthLabel);
            // Randomly position the bee within the container
            const containerWidth = container.offsetWidth - 100;
            const containerHeight = container.offsetHeight - 100;
            const randomX = Math.floor(Math.random() * containerWidth);
            const randomY = Math.floor(Math.random() * containerHeight);
            beeElement.style.left = `${randomX}px`;
            beeElement.style.top = `${randomY}px`;
            container.appendChild(beeElement);
        });
    }
    // Update the bee icons' HP after each attack
    updateBeeIcons() {
        this.bees.forEach((bee, index) => {
            const beeElement = document.getElementById(`bee-${bee.type}-${index}`);
            if (beeElement) {
                if (!bee.isAlive()) {
                    beeElement.classList.add('dead');
                }
            }
        });
    }
    /*
    *
        State of the game
    *
    */
    checkGameOver() {
        // Game over condition 1: All bees are dead except queen
        const allBeesDead = this.aliveBees['worker'] === 0 && this.aliveBees['drone'] === 0;
        // Game over condition 2: The queen bee is dead
        const queenIsDead = this.aliveBees['queen'] === 0;
        if (allBeesDead || queenIsDead) {
            this.endGame();
        }
    }
    // End the game and show the game over screen
    endGame() {
        const gamePage = document.getElementById('game-page');
        const gameOverPage = document.getElementById('game-over-page');
        const finalScore = document.getElementById('final-score');
        gamePage === null || gamePage === void 0 ? void 0 : gamePage.classList.add('hidden');
        gameOverPage === null || gameOverPage === void 0 ? void 0 : gameOverPage.classList.remove('hidden');
        // Game over message
        if (this.aliveBees['queen'] === 0) {
            finalScore.innerText = `The queen bee is dead. Great job, ${this.playerName}!`;
        }
        else {
            finalScore.innerText = `You defeated all the bees. Well done, ${this.playerName}!`;
        }
    }
    // Start new game / Restart
    startNewGame() {
        this.initBees();
        this.updateUI();
    }
}
