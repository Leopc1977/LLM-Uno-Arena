import { Card, Color, colors, Value } from "uno-engine";
import DisplayCard from "./DisplayCard";
import getImageCardPath from "../utils/getImageCardPath";

export default function ChooseColor(
    { card, setCard, value }: { card: Card, setCard: (color: Color) => void, value: Value.WILD | Value.WILD_DRAW_FOUR }
) {
    const handleClickCard = (color: Color) => {
        setCard(color);
    }

    return (
        <div style={{
            display: "flex",
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)",
        }}>
            {(Object.values(Color).filter((v): v is Color => typeof v === "number")).map((color: Color, index: number) => {
                const url: string = getImageCardPath(card, color);
                console.log(url)

                return (
                    <div
                        key={index}
                        style={{
                            position: "relative",
                            color: "#000",
                            padding: "5px",
                            boxShadow: "0 0 5px black",
                            display: "flex",
                            flexDirection: "row",
                            zIndex: 1000,
                        }}
                    >
                        <DisplayCard url={url} card={new Card(value, color)} handleClickCard={() => handleClickCard(color)} />
                    </div>
                )
            })
            }
        </div>
    )
}
