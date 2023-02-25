require('dotenv').config();

module.exports = {
    spl: {
        database: process.env.database,
        user: process.env.user,
        password: process.env.password,
    },
    server: {
        url: "http://120.108.204.99:3000/"
    },
    dev: true,
    url: null,
    types: {
        STATUS: {
            "ONLINE": 1,
            "OFFLINE": 2
        }
    },
    checkLoginInterval: 15
}