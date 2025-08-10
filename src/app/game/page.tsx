"use client"

import useStore from '@/useStore';
import PlayerHand from '../components/PlayerHand';
import Image from 'next/image';
import getImageCardPath from '../utils/getImageCardPath';
import { useEffect, useMemo, useRef, useState } from 'react';
import ChooseColor from '../components/ChooseColor';
import { Card, Value } from 'uno-engine';


export default function Home() {
    const _discardedCard = useRef<HTMLImageElement | null>(null);
    const _deckCard = useRef<HTMLImageElement | null>(null);
    const [currentPlayerName, setCurrentPlayerName] = useState<string>("");
    const [hasdrawn, setHasDrawn] = useState(false);
    const [openColorsChoice, setOpenColorsChoices] = useState<boolean>(false);
    const [wildValueCard, setWildValueCard] = useState<Value.WILD | Value.WILD_DRAW_FOUR>(Value.WILD);

    const { game, initGame } = useStore()
    const players = useMemo(() => [
        "Player 1", "Player 2", "Player 3", "Player 4", "Player 5", "Player 6"
    ], []);

    const [RADIUS, setRADIUS] = useState(0);

    useEffect(() => {
        const updateRadius = () => setRADIUS(window.innerWidth * 0.28);
        updateRadius(); // calcul initial
        window.addEventListener('resize', updateRadius); // recalcul si on redimensionne

        return () => window.removeEventListener('resize', updateRadius);
    }, []);

    useEffect(() => {
        if (!game) {
            initGame(players);
        }
        if (game && game.currentPlayer.name) {
            setCurrentPlayerName(game.currentPlayer.name);
        }
    }, [game, initGame, players]);

    useEffect(() => {
        if (!game) return;

        const handleNextPlayer = () => {
            setCurrentPlayerName(game.currentPlayer.name);
        };

        const handleDraw = () => {
            setHasDrawn(true);
        };

        game.on('nextplayer', handleNextPlayer);
        game.on('draw', handleDraw);

        return () => {
            game.off('nextplayer', handleNextPlayer);
            game.off('draw', handleDraw);
        };
    }, [game]);

    if (!game) return (
        <div>
            <h1>
                LLM Uno Arena
            </h1>
            <p>
                Loading...
            </p>
        </div>
    )

    // game.on('beforedraw', (data) => {
    //     // Fired when a player requests cards from the draw pile.
    // });

    // game.on('beforepass', (data) => {
    //     // Fired when a player can pass and requests to pass its turn.
    // });

    // game.on('beforecardplay', (data: any) => {
    //     console.log(data);
    //     // Fired before player discards a card in the discard pile.
    // });

    // game.on('cardplay', (data: any) => {
    //     // Fired after player's card is thrown in the discard pile.
    //     console.log(data);
    // });

    // game.on('end', (data) => {
    //     // emitted when any player has 0 cards left
    //     // ----------
    //     // the winner gets score based on the cards the other players have remaining at the end:
    //     // - number cards are worth their own value
    //     // - WILD and WD4 are worth 50
    //     // - DRAW TWO, SKIP, and REVERSE are worth 20
    // });

    return (
        <div>
            {game.players.map((player, index) => {
                const playerName: string = player.name;
                const isCurrentPlayer = playerName === currentPlayerName;

                return (
                    <div
                        key={index}
                        style={{
                            position: "absolute",
                            width: "280px",
                            height: "210px",
                            background: "#fff",
                            color: "#000",
                            borderRadius: "10px",
                            padding: "5px",
                            boxShadow: "0 0 5px black",
                            top: "50%",
                            left: "50%",
                            translate: "-50% -50%",
                            display: "flex",
                            flexDirection: "column",
                            fontSize: "14px",
                            transform: `rotate(${360 / players.length * index}deg) translate(${RADIUS}px) rotate(${-360 / players.length * index}deg)`,
                            // overflow: "hidden",
                            border: isCurrentPlayer ? "5px solid red" : "",
                        }}
                    >
                        <h1>{playerName}</h1>
                        <PlayerHand playerName={playerName} _discardedCard={_discardedCard} setOpenColorsChoices={setOpenColorsChoices} setWildValueCard={setWildValueCard} />
                    </div>
                )
            })}
            <Image
                ref={_discardedCard}
                key={"discardedCard"}
                src={getImageCardPath(game.discardedCard)}
                alt={""}
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: 'auto', height: '100px', position: "absolute", top: "50%", left: "50%", translate: "-50% -50%", zIndex: -1 }}
                priority

            />
            <button
                disabled={hasdrawn}
            >
                <Image
                    ref={_deckCard}
                    key={"backsideCard"}
                    src={"/assets/images/others/backside.png"}
                    alt={""}
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: 'auto', height: '100px', position: "absolute", top: "50%", left: "40%", translate: "-50% -50%" }}
                    priority
                    onClick={() => {
                        game.draw(game.currentPlayer, 1);
                    }}
                />
            </button>
            <button onClick={() => { game.pass(); setHasDrawn(false) }}>
                Skip
            </button>

            {openColorsChoice && (
                <ChooseColor
                    card={new Card(wildValueCard, undefined)}
                    value={wildValueCard}
                    setCard={(color) => {
                        const player = game.getPlayer(currentPlayerName);
                        if (!player) return;

                        const card = player.getCardByValue(wildValueCard);

                        card.color = color;
                        game.play(card);
                        setOpenColorsChoices(false);
                    }}
                />
            )}
        </div >
    )
}
