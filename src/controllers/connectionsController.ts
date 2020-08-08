import { Request, Response } from 'express'
import connection from '../database/connection'

export default class ConnectionsController {
	async index(req: Request, res: Response) {
		const connections = await connection('connections').count('* as total')

		const { total } = connections[0]

		return res.json({ total })
	}

	async create(req: Request, res: Response) {
		const { user_id } = req.body

		await connection('connections').insert({
			user_id
		})

		return res.status(201).send()
	}
}
