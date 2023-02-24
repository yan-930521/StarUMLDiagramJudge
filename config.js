require('dotenv').config();

module.exports = {
    spl: {
        database: process.env.database,
        user: process.env.user,
        password: process.env.password,
    },
    server: {
        url: "http://localhost:3000/"
    },
    dev: true,
    url: null
}