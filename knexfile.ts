import path from 'path'

module.exports = {
	client: 'mysql',
	connection: {
		host : process.env.DB_HOST || '127.0.0.1',
		user : process.env.DB_USER || 'root',
		password: process.env.DB_PASSWORD || 'mywordismypassword',
		database: process.env.DB_NAME || 'proffy'
	},
	migrations: {
		directory: path.resolve(__dirname, 'src', 'database', 'migrations')
	}
}
