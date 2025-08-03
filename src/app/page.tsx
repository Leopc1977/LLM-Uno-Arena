// import { api } from "./utils/api";

// export default async function Home() {
//     const { data } = await api.ollama.get({ query: { api: "llama3.2", prompt: "give me a random number between 1 and 1000, only return the number" } });
//     const { data: d } = await api.baml.get({ query: { prompt: "give me a random number between 1 and 1000, only return the number" } });

//     console.log(d)


//     return (
//         <div>
//             <h1>
//                 LLM Uno Arena
//             </h1>
//             <p>
//                 {data}
//                 <br />
//                 {d?.randomNumber}
//             </p>
//         </div>
//     );
// }
"use client"
import { useState, useEffect } from "react";
import { Uno, Color } from "./utils/Uno";

export default function Home() {
    const [game, setGame] = useState<Uno | null>(null);
    const [playerName, setPlayerName] = useState("");
    const [selectedColor, setSelectedColor] = useState<Color | null>(null);

    // Initialiser le jeu à la première charge
    useEffect(() => {
        const newGame = new Uno();
        setGame(newGame);
    }, []);

    // Ajouter joueur
    function handleAddPlayer() {
        if (playerName.trim() && game) {
            game.addPlayer(playerName.trim());
            setPlayerName("");
            // Forcer re-render en clonant l'instance (car instance mutable)
            setGame(Object.assign(Object.create(Object.getPrototypeOf(game)), game));
        }
    }

    // Distribuer les cartes (quand il y a au moins 2 joueurs)
    function handleDealCards() {
        if (game && game.players.length >= 2) {
            game.dealCards();
            setGame(Object.assign(Object.create(Object.getPrototypeOf(game)), game));
        }
    }

    // Jouer une carte
    function handlePlayCard(cardIndex: number) {
        if (!game) return;
        try {
            game.playCard(cardIndex);
            setGame(Object.assign(Object.create(Object.getPrototypeOf(game)), game));
        } catch (err) {
            alert(err instanceof Error ? err.message : "Erreur");
        }
    }

    // Piocher une carte
    function handleDrawCard() {
        if (!game) return;
        game.drawCard();
        setGame(Object.assign(Object.create(Object.getPrototypeOf(game)), game));
    }

    // Sélection de couleur après un wild
    function handleSelectColor(color: Color) {
        if (!game) return;
        game.selectColor(color);
        setSelectedColor(null);
        setGame(Object.assign(Object.create(Object.getPrototypeOf(game)), game));
    }

    if (!game) return <div>Chargement du jeu...</div>;

    if (game.players.length < 2) {
        return (
            <div>
                <h1>Ajouter des joueurs</h1>
                <input
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Nom du joueur"
                />
                <button onClick={handleAddPlayer}>Ajouter</button>
            </div>
        );
    }

    if (game.players.length > 0 && game.discardPile.length === 0) {
        return (
            <div>
                <h2>Joueurs inscrits :</h2>
                <ul>
                    {game.players.map((p) => (
                        <li key={p.name}>{p.name}</li>
                    ))}
                </ul>
                <button onClick={handleDealCards} disabled={game.players.length < 2}>
                    Distribuer les cartes
                </button>
            </div>
        );
    }

    const currentPlayer = game.getCurrentPlayer();

    return (
        <div>
            <h1>Uno</h1>
            <p>
                Tour de : <strong>{currentPlayer.name}</strong>
            </p>
            <p>
                Couleur en cours : <strong>{game.currentColor}</strong> / Valeur en
                cours : <strong>{game.currentValue}</strong>
            </p>

            {game.awaitingColorSelection && (
                <div>
                    <h3>Choisissez une couleur :</h3>
                    {["red", "green", "blue", "yellow"].map((color) => (
                        <button
                            key={color}
                            onClick={() => handleSelectColor(color as Color)}
                        >
                            {color}
                        </button>
                    ))}
                </div>
            )}

            <h3>Votre main :</h3>
            <ul>
                {currentPlayer.hand.map((card, i) => (
                    <li key={i}>
                        <button onClick={() => handlePlayCard(i)}>
                            {card.color} {card.value}
                        </button>
                    </li>
                ))}
            </ul>

            <button onClick={handleDrawCard}>Piocher une carte</button>

            {game.isGameOver && <h2>Partie terminée ! Gagnant : {game.winner}</h2>}
        </div>
    );
}
