require('dotenv').config();

module.exports = {
    spl: {
        database: process.env.database,
        user: process.env.user,
        password: process.env.password,
    },
    dev: true,
    url: null
}