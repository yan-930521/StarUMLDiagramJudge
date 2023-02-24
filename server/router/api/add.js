const express = require("express");
const path = require("path");
const Types = require("../../utils/Types");
const checkLogin = require("../../utils/checkLogin");

const router = express.Router();

const statusCache = {}

const api = {
    path: "/add",
    methods: {
        get: (req, res) => {
            const {
                a, b
            } = req.query;
            res.send({ answer: a + b});
        },
        post: (req, res) => {
            const {
                a, b
            } = req.body;
            
           
            res.send({ answer: a + b });
        }
    }
}

for(let m in api.methods)
    router[m](api.path, api.methods[m]);

module.exports = router;

