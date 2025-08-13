import { Elysia, t } from 'elysia'
import { b } from '../../../../baml_client'

const app = new Elysia({ prefix: '/api' })
    .state('chat', ["test", "test2"])
    .onRequest(({ request }) => {
        console.log(`[${request.method}] ${request.url}`)
    })
    .get('/', () => 'hello Next')
    .get('/ollama', async ({ query: { api, prompt} }) => {
        const response = await fetch('http://localhost:11434/api/chat', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: api.trim(),
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                stream: false,
                temperature: 1.1
            })
        })
        return response.json().then(data => {console.log(data);return data.message.content})
    })
    .get('/baml', async ({ query }) => {
        const { prompt } = query;
        const start = performance.now();
        const response = await b.ExtractResume(prompt);
        const end = performance.now();
        console.log(`Temps écoulé : ${(end - start).toFixed(2)} ms`, `soit ${((end - start)/1000).toFixed(2)} s`);
        return response;
    })
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })

export const GET = app.handle
export const POST = app.handle 

export type App = typeof app
