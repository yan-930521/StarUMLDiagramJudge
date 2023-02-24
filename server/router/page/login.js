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
            res.sendFile(path.join(__dirname, "../../public/index.html"));
        }
    }
}

for(let m in api.methods)
    router[m](api.path, api.methods[m]);

module.exports = router;

