"use client"

import Image from "next/image";
import { Card, Color, Value } from "uno-engine";
import { RefObject, useEffect, useMemo, useRef, useState } from "react";

let _zIndex: number = 1;

export default function DisplayCard({ url, card, handleClickCard }
    : { url: string, card: Card, handleClickCard: (_discardedCard: RefObject<HTMLImageElement>) => void }
) {
    const _displayCard = useRef<HTMLDivElement>(null);
    const currentZindex = useMemo<number>(() => (_zIndex++), []);

    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setAnimate(true);
    }, []);

    const style = {
        transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
        transform: animate ? 'scale(1)' : 'scale(0)',
        opacity: animate ? 1 : 0,
        perspective: "1000px",
        zIndex: currentZindex
    };

    return (
        <div style={style} ref={_displayCard}>
            <div
                style={{
                    borderRadius: 16,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                    position: "relative",
                    cursor: "pointer",
                    background: "transparent",
                    transformStyle: "preserve-3d",
                }}
                onClick={() => handleClickCard(_displayCard)}
            >
                <Image
                    src={url}
                    alt={`${Color[card.color] || ""} ${Value[card.value] || ""}`}
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: 'auto', height: '100px' }}
                    priority
                />
            </div>
        </div>
    )
}
