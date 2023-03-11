require("dotenv").config({path: "../env/.env"});

module.exports = {
    sql1: {
        database: process.env.database1,
        user: process.env.user,
        password: process.env.password,
        host: process.env.host,
        port: process.env.port
    },
    sql2: {
        database: process.env.database2,
        user: process.env.user,
        password: process.env.password,
        host: process.env.host,
        port: process.env.port
    },
    port: 3000
}