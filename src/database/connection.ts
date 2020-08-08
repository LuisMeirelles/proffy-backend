import knex from 'knex'

export default knex({
	client: 'mysql',
	connection: {
		host: '127.0.0.1',
		user: 'root',
		password: 'mywordismypassword',
		database: 'proffy'
	}
})
