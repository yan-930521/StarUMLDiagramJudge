const express = require("express");
const path = require("path");
const Types = require("../../utils/Types");
const checkLogin = require("../../utils/checkLogin");

const router = express.Router();

const statusCache = {}

const api = {
    path: "/login",
    methods: {
        get: (req, res) => {
            const {
                uuid
            } = req.query;
            res.send({ code: statusCache[uuid]});
        },
        post: (req, res) => {
            const {
                uuid,
                account,
                password
            } = req.body;
            
            let success = checkLogin(account, password);

            statusCache[uuid] = Types.STATUS[success? "ONLINE": "OFFLINE"];

            res.send({ code: statusCache[uuid]});
        }
    }
}

for(let m in api.methods)
    router[m](api.path, api.methods[m]);

module.exports = router;

