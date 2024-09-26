import express from 'express'
import type { Request, Response } from 'express'
import cors from 'cors'
import axios from 'axios'

const app = express()

app.use(cors())
app.use(express.json())

type Comment = {
	id: string
	content: string
	postId: string
	status: string
}

type Post = {
	id: string
	title: string
	comments: Comment[]
}

const posts = {} as Record<string, Post>

const handleEvent = (type: string, data: any) => {
	if (type === 'PostCreated') {
		const { id, title } = data

		posts[data.id] = { id, title, comments: [] }
	}

	if (type === 'CommentCreated') {
		const { id, content, postId, status } = data

		const post = posts[postId]
		post.comments.push({
			id,
			content,
			postId,
			status
		})
	}

	if (type === 'CommentUpdated') {
		const { id, postId, status } = data

		const post = posts[postId]
		post.comments = post.comments.map(comment =>
			comment.id === id ? { ...comment, status } : comment
		)
	}
}

app.get('/posts', async (req: Request, res: Response) => {
	res.status(200).json(posts)
})

app.post('/events', (req: Request, res: Response) => {
	const { type, data } = req.body

	handleEvent(type, data)

	res.status(200).json({ message: 'Event Received', data: req.body })
})

app.listen(4002, async () => {
	console.log('Query is listening on port 4002')

	const response = await axios.get('http://localhost:4005/events')

	for (const event of response.data) {
		console.log('Processing event:', event.type)
		handleEvent(event.type, event.data)
	}
})
