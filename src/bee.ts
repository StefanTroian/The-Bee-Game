import { IBee } from './utils/IBee';

export class Bee implements IBee {
    type: string;
    hp: number;

    constructor(type: string, hp: number) {
        this.type = type;
        this.hp = hp;
    }

    attack(): void {
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

    isAlive(): boolean {
        return this.hp > 0;
    }
}
