export interface IBee {
    type: string;
    hp: number;
    
    attack(): void;
    isAlive(): boolean;
}
