import express from 'express'
import type { Request, Response } from 'express'
import cors from 'cors'
import axios from 'axios'

const app = express()

app.use(cors())
app.use(express.json())

app.post('/events', async (req: Request, res: Response) => {
	const { type, data } = req.body

	if (type === 'CommentCreated') {
		const status = data.content.includes('orange') ? 'rejected' : 'approved'

		await axios.post('http://localhost:4005/events', {
			type: 'CommentModerated',
			data: {
				...data,
				status
			}
		})
	}

	res.status(200).json({ message: 'Event Received', data: req.body })
})

app.listen(4003, () => console.log('Moderation is listening on port 4003'))
