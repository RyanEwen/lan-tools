import mysql2 from 'mysql2'
import Sequelize from 'sequelize'

var sequelize

const mysqlInfo = {
    host: process.env.DBHOST || 'localhost',
    port: process.env.DBPORT || 3306,
    user: process.env.DBUSER || 'root',
    pass: process.env.DBPASS || 'example',
    dbname: process.env.DBNAME || 'app',
}

function createDatabaseIfNotExists() {
    const connection = mysql2.createConnection({
        host: mysqlInfo.host,
        port: mysqlInfo.port,
        user: mysqlInfo.user,
        password: mysqlInfo.pass,
    })

    connection.query(`CREATE DATABASE IF NOT EXISTS \`${mysqlInfo.dbname}\`;`)
}

export default function () {
    if (sequelize) {
        return sequelize
    }

    createDatabaseIfNotExists()

    sequelize = new Sequelize(
        mysqlInfo.dbname,
        mysqlInfo.user,
        mysqlInfo.pass,
        {
            host: mysqlInfo.host,
            dialect: 'mysql',
            dialectModule: mysql2,
            logging: false, // TODO log somewhere
        }
    )

    sequelize.sync().catch((err) => {
        throw new Error('Unable to connect to the database:', err)
    })

    return sequelize
}
