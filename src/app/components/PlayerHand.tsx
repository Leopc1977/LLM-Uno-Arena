"use client"

import useStore from "@/useStore";
import getImageCardPath from "../utils/getImageCardPath";
import DisplayCard from "./DisplayCard";
import { RefObject, useEffect, useState } from "react";
import { Card, isWild, Value } from "uno-engine";

export default function PlayerHand(
    { playerName, _discardedCard, setOpenColorsChoices, setWildValueCard }
        : { playerName: string, _discardedCard: RefObject<HTMLImageElement | null>, setOpenColorsChoices: (value: boolean) => void, setWildValueCard: (value: Value.WILD | Value.WILD_DRAW_FOUR) => void }
) {

    const { game } = useStore();
    const player = game?.getPlayer(playerName);
    const [hand, setHand] = useState<Card[]>([]);

    useEffect(() => {
        if (!player) return;

        setHand(player.hand);
    }, [player])

    useEffect(() => {
        if (!game || !player) return;

        const updateHand = () => {
            setHand(player.hand);
        }

        game.on('draw', updateHand);
        game.on('cardplay', updateHand);
        game.on('nextplayer', updateHand);

        return () => {
            game.off('draw', updateHand);
            game.off('cardplay', updateHand);
            game.off('nextplayer', updateHand);
        }
    }, [game, player])

    if (!game || !player) return (<></>);

    const handleClickCard = (card: Card, _displayCard: RefObject<HTMLDivElement | null>) => {
        if (!game) return;
        if (game.currentPlayer !== player) return;
        if (game && !card.matches(game.discardedCard)) return
        if (!_displayCard.current || !_discardedCard?.current) return;

        if (isWild(card.value)) {
            handleWildCard(card);
            return;
        }

        game?.play(card)
    }

    const handleWildCard = (card: Card) => {
        if (!card || !card.value) return;
        if (card.value === Value.WILD_DRAW_FOUR || card.value === Value.WILD) {
            setOpenColorsChoices(true);
            setWildValueCard(card.value);
            return;
        }
    }

    return (
        <div
            style={{
                display: "flex",
                flexWrap: "wrap",

            }}
        >
            {hand.map((card, index) => {
                const url = getImageCardPath(card);

                return (
                    <DisplayCard
                        key={index}
                        url={url}
                        card={card}
                        handleClickCard={(_displayCard) => handleClickCard(card, _displayCard)}
                    />
                )
            })}
        </div>
    )
}
