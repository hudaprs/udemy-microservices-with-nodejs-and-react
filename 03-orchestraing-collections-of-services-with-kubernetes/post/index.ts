import express from 'express'
import type { Request, Response } from 'express'
import crypto from 'crypto'
import cors from 'cors'
import axios from 'axios'

const app = express()

app.use(cors())
app.use(express.json())

type Post = {
	id: string
	title: string
}

const posts = {} as Record<string, Post>

app.get('/posts', async (req: Request, res: Response) => {
	res.status(200).json(posts)
})

app.post('/posts/create', async (req: Request, res: Response) => {
	const id = crypto.randomBytes(4).toString('hex')
	const { title } = req.body

	const payload = {
		id,
		title
	}

	posts[id] = payload

	await axios.post('http://event-bus-srv:4005/events', {
		type: 'PostCreated',
		data: payload
	})

	res.status(201).json(posts)
})

app.post('/events', (req: Request, res: Response) => {
	console.log('Event Received', req.body)

	res.status(200).json({ message: 'Event Received', data: req.body })
})

app.listen(4000, () => console.log('Post is listening on port 4000'))
