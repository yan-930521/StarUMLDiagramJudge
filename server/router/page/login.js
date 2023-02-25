const express = require("express");
const path = require("path");

const api = {
    path: "/login",
    superior: null,
    isDev: false,
    methods: {
        get: (req, res) => {
            res.sendFile(path.join(__dirname, "../../public/index.html"));
        }
    }
}

module.exports = api;

