export class Bee {
    constructor(type, hp) {
        this.type = type;
        this.hp = hp;
    }
    attack() {
        switch (this.type) {
            case 'queen':
                this.hp -= 8;
                break;
            case 'worker':
                this.hp -= 10;
                break;
            case 'drone':
                this.hp -= 12;
                break;
        }
        if (this.hp < 0) {
            this.hp = 0;
        }
    }
    isAlive() {
        return this.hp > 0;
    }
}
