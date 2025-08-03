export const ACTION_VALUES = ["skip", "reverse", "draw2"] as const;
export type Action = typeof ACTION_VALUES[number];

export const COLOR_VALUES = ["red", "green", "blue", "yellow"] as const;
export type Color = typeof COLOR_VALUES[number];

export const WILD_VALUES = ["wild", "wild+4"] as const;
export type Wild = typeof WILD_VALUES[number];

type NumberCard = {
    type: "number";
    color: Color;
    value: number; // 0–9
};

type ActionCard = {
    type: "action";
    color: Color;
    value: Action;
};

type WildCard = {
    type: "wild";
    color: "wild"; // always "wild"
    value: Wild;
};

type Card = NumberCard | ActionCard | WildCard;

export class Uno {
    players: { name: string; hand: Card[] }[];
    deck: Card[];
    discardPile: Card[];
    currentPlayerIndex: number;
    direction: number;
    currentColor: string | null;
    currentValue: string | number | null;
    awaitingColorSelection: boolean;
    awaitingChallenge: boolean;

    isGameOver: boolean;
    winner: string | null;

    constructor() {
        this.players = [];
        this.deck = this.generateDeck();
        this.discardPile = [];
        this.currentPlayerIndex = 0;
        this.direction = 1;
        this.currentColor = null;
        this.currentValue = null;
        this.awaitingColorSelection = false;
        this.awaitingChallenge = false;
        this.isGameOver = false;
        this.winner = null;

        console.log("Uno initialized");
    }

    generateDeck() {
        const deck: Card[] = [];

        // Number cards (0 once, 1–9 twice per color)
        COLOR_VALUES.forEach(color => {
            deck.push({type: "number", color: color, value: 0});
            for (let i = 1; i <= 9; i++) {
                deck.push({ type: "number", color: color, value: i });
                deck.push({ type: "number", color: color, value: i });
            }

            // 2× Skip, Reverse, Draw Two per color
            ACTION_VALUES.forEach(type => {
                deck.push({ type: "action", color: color, value: type });
                deck.push({ type: "action", color: color, value: type });
            });
        });

        // 4 Wild, 4 Wild Draw Four
        for (let i = 0; i < 4; i++) {
            WILD_VALUES.forEach(value => {
                deck.push({ type: "wild", color: "wild", value: value });
            });
        }

        return this.shuffle(deck);
    }

    shuffle(array: Card[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    addPlayer(name: string) {
        if (this.players.length >= 10) throw new Error("Max players reached");
        this.players.push({ name, hand: [] });
    }

    dealCards() {
        for (let i = 0; i < 7; i++) {
            this.players.forEach(player => {
                player.hand.push(this.deck.pop()!);
            });
        }
        let firstCard: Card | undefined;

        while (this.deck.length > 0) {
          const card = this.deck.pop();
          if (card && card.color !== "wild") {
            firstCard = card;
            break;
          }
        }
        
        if (!firstCard) {
          throw new Error("No non-wild cards available to start the game.");
        }
        
        this.discardPile.push(firstCard);
        this.currentColor = firstCard.color;
        this.currentValue = firstCard.value;
    }

    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    isPlayable(card: Card) {
        return (
            card.color === this.currentColor ||
            card.value === this.currentValue ||
            card.color === "wild"
        );
    }

    playCard(cardIndex: number) {
        const player = this.getCurrentPlayer();
        const card = player.hand[cardIndex];
        if (!this.isPlayable(card)) throw new Error("Card not playable");

        player.hand.splice(cardIndex, 1);
        this.discardPile.push(card);
        this.currentColor = card.color === "wild" ? null : card.color;
        this.currentValue = card.value;

        switch (card.value) {
            case "skip":
                this.nextPlayer();
                break;
            case "reverse":
                this.direction *= -1;
                break;
            case "draw2":
                this.nextPlayer();
                this.drawCards(this.getCurrentPlayer(), 2);
                break;
            case "wild":
                this.awaitingColorSelection = true;
                break;
            case "wild+4":
                this.awaitingColorSelection = true;
                this.awaitingChallenge = true;
                break;
        }

        if (player.hand.length === 0) {
            console.log(`${player.name} has won!`);
        } else {
            this.nextPlayer();
        }
        this.checkEndGame();
    }

    drawCard() {
        const player = this.getCurrentPlayer();
        if (this.deck.length === 0) {
            this.checkEndGame();
            return;
        }
        const card = this.deck.pop();
        if (!card) throw new Error("No cards left in the deck")
        player.hand.push(card);
        this.checkEndGame();
        return card;
    }

    drawCards(player: { hand: Card[] }, count: number) {
        for (let i = 0; i < count; i++) {
            if (this.deck.length === 0) {
                this.checkEndGame();
                return;
            };
            player.hand.push(this.deck.pop()!);
        }
        this.checkEndGame();
    }

    nextPlayer() {
        const numPlayers = this.players.length;
        this.currentPlayerIndex =
            (this.currentPlayerIndex + this.direction + numPlayers) % numPlayers;
    }

    selectColor(color: Color) {
        if (!this.awaitingColorSelection) throw new Error("Not waiting for color selection");
        this.currentColor = color;
        this.awaitingColorSelection = false;
        if (this.awaitingChallenge) {
            this.awaitingChallenge = false;
            this.nextPlayer();
            this.drawCards(this.getCurrentPlayer(), 4);
        }
    }

    challengeDrawFour(challengerIndex: number) {
        const previousPlayer = this.players[
            (this.currentPlayerIndex - this.direction + this.players.length) % this.players.length
        ];
        const hasPlayable = previousPlayer.hand.some(card =>
            card.color === this.currentColor || card.value === this.currentValue
        );

        if (hasPlayable) {
            this.drawCards(previousPlayer, 4);
        } else {
            this.drawCards(this.players[challengerIndex], 6);
        }

        this.awaitingChallenge = false;
    }

    checkEndGame() {
        const winnerByEmptyHand = this.players.find(p => p.hand.length === 0);
        if (winnerByEmptyHand) {
            this.isGameOver = true;
            this.winner = winnerByEmptyHand.name;
            console.log(`${this.winner} has won by playing all their cards!`);
        }

        if (this.deck.length === 0) {
            const winnerByFewestCards = this.players.reduce((a, b) =>
                a.hand.length <= b.hand.length ? a : b
            );
            this.isGameOver = true;
            this.winner = winnerByFewestCards.name;
            console.log(`${this.winner} has won by having the fewest cards!`);
        }
    }    
}
