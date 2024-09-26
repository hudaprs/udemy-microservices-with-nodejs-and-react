import express from 'express'
import type { Request, Response } from 'express'
import crypto from 'crypto'
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

const commentsByPostId = {} as Record<string, Comment[]>

app.get('/posts/:postId/comments', (req: Request, res: Response) => {
	res.status(200).json(commentsByPostId[req.params.postId] || [])
})

app.post('/posts/:postId/comments', async (req: Request, res: Response) => {
	const id = crypto.randomBytes(4).toString('hex')
	const { content } = req.body

	const comments = commentsByPostId[req.params.postId] || []

	const payload = {
		id,
		content,
		postId: req.params.postId,
		status: 'pending'
	}

	comments.push(payload)

	commentsByPostId[req.params.postId] = comments

	await axios.post('http://localhost:4005/events', {
		type: 'CommentCreated',
		data: payload
	})

	res.status(201).json(comments)
})

app.post('/events', async (req: Request, res: Response) => {
	const { type, data } = req.body
	console.log('Event Received', req.body)

	if (type === 'CommentModerated') {
		const { id, postId, status } = data
		const comments = commentsByPostId[postId] as Comment[]
		const comment = comments.find(comment => comment.id === id)
		if (comment) {
			comment.status = status
		}

		await axios.post('http://localhost:4005/events', {
			type: 'CommentUpdated',
			data: comment
		})
	}

	res.status(200).json({ message: 'Event Received', data: req.body })
})

app.listen(4001, () => console.log('Comment is listening on port 4001'))
