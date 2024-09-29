import express from 'express'
import type { Request, Response } from 'express'
import cors from 'cors'
import axios from 'axios'

const app = express()

type Event = {
	type: string
	data: unknown
}

const events: Event[] = []

app.use(cors())
app.use(express.json())

app.get('/events', (req: Request, res: Response) => {
	res.status(200).json(events)
})

app.post('/events', (req: Request, res: Response) => {
	const event = req.body

	events.push(event)

	axios.post('http://post-clusterip-srv:4000/events', event)
	axios.post('http://comment-srv:4001/events', event)
	axios.post('http://query-srv:4002/events', event)
	axios.post('http://moderation-srv:4003/events', event)

	res.status(200).json({ message: 'OK' })
})

app.listen(4005, () => console.log('Event Bus is listening on port 4005'))
