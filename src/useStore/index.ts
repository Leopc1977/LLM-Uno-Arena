import { create } from 'zustand'
import { Game } from 'uno-engine';

interface UnoState {
    game: Game | null;
    initGame: (
        playerNames: string[],
        houseRules?: {
            setup: (game: Game) => void;
        }[]
    ) => void;
}

export default create<UnoState>((set) => ({
    game: null,
    initGame: (
        playerNames: string[],
        houseRules?: {
            setup: (game: Game) => void;
        }[]
    ) => set(() => ({ game: new Game(playerNames, houseRules) })),
}));
