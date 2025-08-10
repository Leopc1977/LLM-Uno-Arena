import { api } from "./utils/api";

export default async function Home() {
    // const { data } = await api.ollama.get({ query: { api: "llama3.2", prompt: "give me a random number between 1 and 1000, only return the number" } });
    // const { data: d } = await api.baml.get({ query: { prompt: "give me a random number between 1 and 1000, only return the number" } });

    // console.log(d);

    return (
        <div>
            <h1>
                LLM Uno Arena
            </h1>
            <p>
                {/* {data}
                <br />
                {d?.randomNumber} */}
            </p>
        </div>
    );
}
