import { Hono } from 'hono'

const app = new Hono()

// app.get('/', (c) => {
// 	return c.text('Hello World!')
// })

// app.get('/ping', (c) => {
// 	return c.text('pong')
// })

// app.get('/json', (c) => {
// 	return c.json({hoge: 'fuga'})
// })

app.get('/ab/page', (c) => {
	console.log(c.req.url)
	const url = new URL(c.req.url)
	url.port = '3000'	// 8787 で受けたのを 3000 にリダイレクトする
	url.pathname = Math.random() < 0.5 ? '/ab/page-a' : '/ab/page-b'
	// const raw = c.req.raw
	return fetch(url, { headers: c.req.headers, body: c.req.body })
})


app.all('*', (c) => {
	console.log(c.req.url)
	const url = new URL(c.req.url)
	url.port = '3000'	// 8787 で受けたのを 3000 にリダイレクトする
	// const raw = c.req.raw
	return fetch(url, { headers: c.req.headers, body: c.req.body })
})

export default app
