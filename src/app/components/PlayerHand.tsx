"use client"

import useStore from "@/useStore";
import getImageCardPath from "../utils/getImageCardPath";
import DisplayCard from "./DisplayCard";
import { RefObject } from "react";
import { Card, isWild, Value } from "uno-engine";

export default function PlayerHand(
    { playerName, setOpenColorsChoice, setWildValueCard }
        : { playerName: string, setOpenColorsChoice: (value: boolean) => void, setWildValueCard: (value: Value.WILD | Value.WILD_DRAW_FOUR) => void }
) {

    const { game } = useStore();
    const player = game?.getPlayer(playerName);
    const hand = player?.hand;

    if (!game || !player) return (<></>);

    const handleClickCard = (card: Card, _displayCard: RefObject<HTMLDivElement | null>) => {
        if (!game) return;
        if (game.currentPlayer !== player) return;
        if (game && !card.matches(game.discardedCard)) return
        if (!_displayCard.current) return;

        if (isWild(card.value)) {
            handleWildCard(card);
            return;
        }

        game?.play(card)
    }

    const handleWildCard = (card: Card) => {
        if (!card || !card.value) return;
        if (card.value === Value.WILD_DRAW_FOUR || card.value === Value.WILD) {
            setOpenColorsChoice(true);
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
            {hand?.map((card, index) => {
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
