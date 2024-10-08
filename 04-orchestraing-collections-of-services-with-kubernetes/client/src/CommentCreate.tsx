import { FormEvent, useState } from 'react'
import axios from 'axios'

type CommentCreateProps = {
	postId: string
}

const CommentCreate = ({ postId }: CommentCreateProps) => {
	const [content, setContent] = useState('')

	const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		await axios.post(`http://udemy-post.com/posts/${postId}/comments`, {
			content
		})

		setContent('')
	}

	return (
		<div>
			<form onSubmit={onSubmit}>
				<div className='form-group mb-2'>
					<label>New Comment</label>
					<input
						value={content}
						onChange={e => setContent(e.target.value)}
						className='form-control'
					/>
				</div>
				<button className='btn btn-primary'>Submit</button>
			</form>
		</div>
	)
}

export default CommentCreate
