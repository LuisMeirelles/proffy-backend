import { Request, Response } from 'express'

import connection from '../database/connection'
import hourToMinutes from '../utils/hourToMinutes'

interface ScheduleItem {
	day: number,
	from: string,
	to: string
}

export default class ClassesController {
	async index(req: Request, res: Response) {
		const filters = req.query

		const subject = filters.subject as string
		const day = filters.day as string
		const time = filters.time as string

		if (!filters.day || !filters.subject || !filters.time) {
			return res.status(400).json({
				error: 'Missing filters to search classes'
			})
		}

		const timeInMinutes = hourToMinutes(time)

		const classes = await connection('classes')
			.whereExists(function() {
				this.select('class_schedule.*')
					.from('class_schedule')
					.whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
					.whereRaw('`class_schedule`.`day`= ??', [Number(day)])
					.whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
					.whereRaw('`class_schedule`.`to` > ??', [timeInMinutes])
			})
			.where('classes.subject', '=', subject)
			.join('users', 'classes.user_id', '=', 'users.id')
			.select(['classes.*', 'users.*'])

		return res.json(classes)
	}

	async create(req: Request, res: Response) {
		const {
			name,
			avatar,
			whatsapp,
			bio,
			subject,
			cost,
			schedule
		} = req.body

		const trx = await connection.transaction()

		try {
			const userIds = await trx('users').insert({
				name,
				avatar,
				whatsapp,
				bio
			})

			const user_id = userIds[0]

			const classIds = await trx('classes').insert({
				subject,
				cost,
				user_id
			})

			const class_id = classIds[0]

			const classSchedule = schedule.map((scheduleItem: ScheduleItem) => ({
				class_id,
				day: scheduleItem.day,
				from: hourToMinutes(scheduleItem.from),
				to: hourToMinutes(scheduleItem.to)
			}))

			await trx('class_schedule').insert(classSchedule)

			await trx.commit()

			return res.status(201).send()
		} catch (err) {
			console.warn(err)

			await trx.rollback()

			return res.status(400).json({
				error: 'Unexpected error while creating new class'
			})
		}
	}
}
