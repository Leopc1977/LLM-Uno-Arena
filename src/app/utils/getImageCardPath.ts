import { Card, Color, Value } from "uno-engine";

function getColorName(c?: Color) {
    return c !== undefined ? Color[c].toString().toLowerCase() : "black";
}

export default function getImageCardPath(
    card: Card, color?: Color
): string {
    const actualColor = color ?? card.color;
    const valueName = Value[card.value];

    if (valueName === "WILD") {
        return `/assets/images/change-color/${getColorName(actualColor)}.svg`;
    }
    if (valueName === "WILD_DRAW_FOUR") {
        return `/assets/images/buy-4/${getColorName(actualColor)}.svg`;
    }
    if (valueName === "SKIP") {
        return `/assets/images/block/${getColorName(card.color)}.svg`;
    }
    if (valueName === "REVERSE") {
        return `/assets/images/reverse/${getColorName(card.color)}.svg`;
    }
    if (valueName === "DRAW_TWO") {
        return `/assets/images/buy-2/${getColorName(card.color)}.svg`;
    }

    return `/assets/images/${card.value}/${getColorName(card.color)}.svg`;
}
