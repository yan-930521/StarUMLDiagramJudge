const express = require("express");
const path = require("path");
const Types = require("../utils/Types");
const checkLogin = require("../utils/checkLogin");

const router = express.Router();

const api = {
    path: "/login",
    methods: {
        post: (req, res) => {
            console.log(req.body);
            //const uuid = req.params.uuid;
            //console.log(`uuid: ${uuid} login to system.`);
            //console.log(req);
            //let res_check = checkLogin();
            //res.send(res_check);
        }
    }
}

for(let m in api.methods)
    router[m](api.path, api.methods[m]);

module.exports = router;

