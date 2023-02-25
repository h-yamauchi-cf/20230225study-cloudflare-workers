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

app.get('/api/cache', async (c) => {

	const cache = caches.default

	const cacheRes = await cache.match('http://localhost:3000/api/cache')
	if (cacheRes) {
		return cacheRes
	}

	let res = await fetch('http://localhost:3000/api/cache', {
		headers: c.req.headers,
		body: c.req.body, 
		cf: {
			cacheTtl: 30,
		}
	})

	res = res.clone()
	res.headers.set('Cache-Control', 's-maxage=30')

	cache.put('http://localhost:3000/api/cache', res.clone())

	return res

})


app.get('/example', async () => {

	const rewriter = new HTMLRewriter()
	rewriter.on('h1', { element: (element) => { element.setInnerContent('Test') } })

	let res = await fetch('https://example.com')

	// res.headers.set('Cache-Control', 's-maxage=30')

	return rewriter.transform(res)

})

app.get('/ab/page', async (c) => {
		console.log(c.req.url)
	const url = new URL(c.req.url)
	url.port = '3000'	// 8787 で受けたのを 3000 にリダイレクトする

	const abPath = c.req.cookie('ab')
	if (abPath) {
		url.pathname = abPath
	} else {
		url.pathname = Math.random() < 0.5 ? '/ab/page-a' : '/ab/page-b'
	}

	// const raw = c.req.raw
	let res = await fetch(url, { headers: c.req.headers, body: c.req.body })
	res = res.clone()
	res.headers.set('Set-Cookie', `ab=${url.pathname}`)
	return res
})


app.all('*', (c) => {
	console.log(c.req.url)
	const url = new URL(c.req.url)
	url.port = '3000'	// 8787 で受けたのを 3000 にリダイレクトする
	// const raw = c.req.raw
	return fetch(url, { headers: c.req.headers, body: c.req.body })
})

export default app
