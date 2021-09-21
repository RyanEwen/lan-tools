import mysql2 from 'mysql2'
import Sequelize from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

var sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASS,
    {
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        dialect: 'mysql',
        dialectModule: mysql2,
        logging: false, // TODO log somewhere
    }
)

sequelize.sync({ alter: true }).then(() => {
    console.log('Sequelize initialized')
})

export default sequelize
