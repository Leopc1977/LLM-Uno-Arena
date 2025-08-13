"use client";
import { useEffect, useState } from "react";
import { api } from "./utils/api";

export default function Home() {
    const [ollamaData, setOllamaData] = useState("");
    const [bamlData, setBamlData] = useState<number>();

    useEffect(() => {
        (async () => {
            // const { data } = await api.ollama.get({ query: { api: "qwen3:0.6b", prompt: "give me a random number between 1 and 1000, only return the number" } });
            // setOllamaData(data);
            const { data: d } = await api.baml.get({ query: { prompt: "give me a random number between 1 and 1000, only return the number" } });
            setBamlData(d?.randomNumber);
        })();
    }, []);

    const handleClick = async () => {
        const { data: d } = await api.baml.get({ query: { prompt: "give me a random number between 1 and 1000, only return the number" } });
        // const { data } = await api.ollama.get({ query: { api: "qwen3:0.6b", prompt: "give me a random number between 1 and 1000, only return the number" } });

        if (!d || !d.randomNumber) return;
        // setOllamaData(data);
        setBamlData(d.randomNumber);

        console.log(d?.randomNumber)
    }

    return (
        <div>
            <h1>LLM Uno Arena</h1>
            <p>
                {ollamaData}
                <br />
                {bamlData}
            </p>
            <button onClick={handleClick}>update</button>
        </div>
    );
}
