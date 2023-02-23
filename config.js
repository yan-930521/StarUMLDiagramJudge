require('dotenv').config();

module.exports = {
    spl: {
        database: process.env.database,
        user: process.env.user,
        password: process.env.password,
    },
    server: {
        dataServer: {
            url: "http://localhost:3000/"
        },
        webServer: {
            url: "http://localhost:3030/"
        }
    },
    dev: true,
    url: null
}