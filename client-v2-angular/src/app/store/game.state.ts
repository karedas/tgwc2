
export interface GameState {
    players: number,
    time: Date;
    serverStatus: string;
}


export const initializeGameState = function() {
    return {
        players: 0,
        time: new Date(),
    }
}

