import knex from 'knex'
import 'dotenv/config'

const host = process.env.DB_HOST
const user = process.env.DB_USER
const password = process.env.DB_PASSWORD
const database = process.env.DB_NAME

export default knex({
	client: 'mysql',
	connection: {
		host,
		user,
		password,
		database
	}
})
