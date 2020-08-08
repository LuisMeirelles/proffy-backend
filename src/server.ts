import express from 'express'

const app = express()

app.get('/', (req, res) => {
	return res.json({ message: 'hello world' })
})

app.listen(3333)
