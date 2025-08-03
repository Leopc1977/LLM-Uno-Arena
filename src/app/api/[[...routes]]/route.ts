import { Elysia, t } from 'elysia'
import { b } from '../../../../baml_client'

const app = new Elysia({ prefix: '/api' })
    .onRequest(({ request }) => {
        console.log(`[${request.method}] ${request.url}`)
    })
    .get('/', () => 'hello Next')
    .get('/ollama', async ({ query }) => {
        const { api, prompt } = query
        const response = await fetch('http://localhost:11434/api/chat', {
            method: 'POST',
            body: JSON.stringify({
                model: api,
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
        return response.json().then(data => data.message.content)
    })
    .get('/baml', async ({ query }) => {
        const { prompt } = query
    
        const response = await b.ExtractResume(prompt);
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
