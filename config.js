require("dotenv").config({path: "./env/.env"});

module.exports = {
    spl: {
        database: process.env.database,
        user: process.env.user,
        password: process.env.password,
    },
    server: {
        url: "http://localhost:3000/" //120.108.204.99
    },
    dev: true,
    url: null,
    Types: {
        STATUS: {
            "ONLINE": 1,
            "OFFLINE": 2,
            "USERNOTFOUND": 3
        }
    },
    checkLoginInterval: 15
}